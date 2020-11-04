import csv from 'csv-parser';
import http from 'http';
import { mapKeys, flattenDeep } from 'lodash';
import DownloadModel from './download.model';
import MatchService from '../match/match.service';
import CompetitionService from '../competition/competition.service';
import { isArrayNotEmpty, yearToSeason, lowerCaseString } from '../../utils/functions';
import InvalidCompetititons from '../../utils/errors/invalid-competitions';

const DownloadService = () => {
  const date = new Date();
  // año de la primera temporada con datos para descargar
  const firsYear = parseInt(process.env.FIRST_YEAR, 10);
  // año de la temporada actual
  const actualYear = parseInt(process.env.ACTUAL_YEAR, 10);
  // Indica si la tarea descargará los partidos de todas las temporadas o solo de la actual
  const downloadType = process.env.DOWNLOAD_TYPE;

  /**
     * Renombra algunas de las claves de las columnas del CSV descargado porque
     * tienen nombres que pueden dar problemas con JS
     *
     */
  const formatData = (objMatch) => {
    const renamedProperties = {
      Div: 'competition',
      Date: 'matchDate',
      'B365>2.5': 'b365o25',
      'B365<2.5': 'b365u25',
      'P>2.5': 'po25',
      'P<2.5': 'pu25',
      'Max>2.5': 'maxo25',
      'Max<2.5': 'maxu25',
      'Avg>2.5': 'avgo25',
      'Avg<2.5': 'avgu25',
      'B365C>2.5': 'b365co25',
      'B365C<2.5': 'b365cu25',
      'PC>2.5': 'pco25',
      'PC<2.5': 'pcu25',
      'MaxC>2.5': 'maxco25',
      'MaxC<2.5': 'maxcu25',
      'AvgC>2.5': 'avgc025',
      'AvgC<2.5': 'avgcu25',
    };
    const match = objMatch;
    const arrDates = match.Date.split('/');
    match.Date = new Date(arrDates[2], arrDates[1] - 1, arrDates[0]);
    return mapKeys(match, (value, key) => lowerCaseString(renamedProperties[key] || key));
  };

  /**
    * Descarga los datos en formato CSV de una competición en una temporada
    *
    */
  const downloadCsv = (year, competition) => new Promise((resolve, reject) => {
    // Genera un string con el formato correcto de la temporada que hay que usar para la descarga
    const season = yearToSeason(year);
    const results = [];
    const url = `${process.env.URL_DOWNLOAD_SERVER + season}/${competition}.csv`;
    console.log('DOWNLOAD', url);
    http.get(url, (data) => {
      data
        .pipe(csv())
        .on('data', (downloadedData) => results.push(formatData(downloadedData)))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    }).on('error', (err) => reject(err));
  });

  /**
    * Descarga los partidos de la temporada actual para las competiciones especificadas
    *
    */
  const actualSeason = async (competitions) => {
    const promises = competitions.map(
      async (competition) => downloadCsv(actualYear, competition),
    );
    return Promise.all(promises);
  };

  /**
    * Descarga los partidos de todas las temporadas disponibles para las competiciones especificadas
    *
    */
  const allSeasons = (competitions) => {
    const promises = [];
    for (let year = firsYear; year <= actualYear; year += 1) {
      promises.push(
        ...competitions.map(async (competition) => downloadCsv(year, competition)),
      );
    }
    return Promise.all(promises);
  };

  /**
    * Guarda los datos de la descarga en base de datos
    *
    */
  const saveDownloadInfo = (numInserts, errs) => {
    const objDownload = {
      date,
      executionTime: Date.now() - date.getTime(),
      numInserts,
      errs,
    };
    const download = new DownloadModel(objDownload);
    return download.save();
  };

  /**
    * Devuelve los datos de la última descarga ejecutada
    *
    */
  const getLastDownload = async () => {
    const lastDownload = await DownloadModel.find().sort({ _id: -1 }).limit(1);
    return lastDownload[0];
  };

  /**
    * Ejecuta la descarga de los partidos y los inserta en base de datos
    *
    */
  const executeDownload = async () => {
    try {
      // Competiciones a descargar
      const competitionService = CompetitionService();
      const competitions = await competitionService.getIds();
      if (!isArrayNotEmpty(competitions)) {
        throw new InvalidCompetititons('Array de competiciones vacío', competitions);
      }
      // Descarga e insercción de los partidos
      const matchService = MatchService();
      const downloadedMatches = downloadType === 'all' ? await allSeasons(competitions) : await actualSeason(competitions);
      const download = await matchService.insertMatches(flattenDeep(downloadedMatches));
      await saveDownloadInfo(download.length || 0);
    } catch (e) {
      if (e instanceof InvalidCompetititons) {
        await saveDownloadInfo(0, [e.getFormat()]);
      } else {
        // Me quedo solo con los errores que no sean 11000, Duplicate key entry
        const errs = e.writeErrors.filter((err) => err.code !== 11000);
        await saveDownloadInfo(e.insertedDocs.length || 0, errs);
      }
    }
  };

  return Object.freeze({
    getLastDownload,
    executeDownload,
  });
};

export default DownloadService;
