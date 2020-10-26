import DownloadModel from "./download.model";
import MatchService from "../match/match.service";
import CompetitionService from "../competition/competition.service";
import csv from "csv-parser";
import http from "http";
import {mapKeys} from "lodash";


const DownloadService = () => {

    const date = new Date;

    /**
     * Renombra algunas de las claves de las columnas del CSV descargado porque tienen nombres que pueden dar problemas con JS 
     * 
     */
    const renameKeys = objMatch => {
        const renamedProperties = {
            "Div" : "Division",
            "B365>2.5" : "B365O25",
            "B365<2.5" : "B365U25",
            "P>2.5" : "PO25",
            "P<2.5" : "PU25",
            "Max>2.5" : "MaxO25",
            "Max<2.5" : "MaxU25",
            "Avg>2.5" : "AvgO25",
            "Avg<2.5" : "AvgU25",
            "B365C>2.5" : "B365CO25",
            "B365C<2.5" : "B365CU25",
            "PC>2.5" : "PCO25",
            "PC<2.5" : "PCU25",
            "MaxC>2.5" : "MaxCO25",
            "MaxC<2.5" : "MaxCU25",
            "AvgC>2.5" : "AvgC025",
            "AvgC<2.5" : "AvgCU25"
        };
        mapKeys(objMatch, (value, key) => renamedProperties[key] || key )
    };

    /**
    * Descarga los datos en formato CSV de una competición en una temporada
    * 
    */ 
    const downloadCsv = (year, competition) => new Promise((resolve, reject) => {
        //Genera un string con el formato correcto de la temporada que hay que usar para descargar el CSV 
        const season = (year-1).toString().substr(2).concat(year.toString().substr(2)); 
        const results = [];
        const url = process.env.URL_DOWNLOAD_SERVER + season + "/" + competition + ".csv";
        console.log("DOWNLOAD", url);
        http.get(url, data => {
            data
            .pipe(csv())
            .on("data", data => {results.push(renameKeys(data))})
            .on("end", () => resolve(results))
            .on("error", err => reject(err))
        }).on("error", err => reject(err));
    });
    
    /**
    * Descarga los partidos de la temporada actual para las competiciones especificadas
    * 
    */ 
    const actualSeason = (competitions) => new Promise(async (resolve, reject) => {        
        const results = [];
        for(const competition of competitions){
            const matches = await downloadCsv(process.env.ACTUAL_YEAR, competition);
            results.push(...matches);
        }        
        resolve(results);
    });

    /**
    * Descarga los partidos de todas las temporadas disponibles para las competiciones especificadas
    * 
    */ 
    const allSeasons = (competitions) => new Promise(async (resolve, reject) => {
        //año de la primera temporada disponible para descargar
        const firstYear = 1994;
        const results = [];
        for(const competition of competitions){
            //hago un bucle para obtener todas las temporadas de esa competicion desde la primera disponible a la actual
            for(let year = firstYear; year <= process.env.ACTUAL_YEAR; year++ ){
                const matches = await downloadCsv(year, competition);
                results.push(...matches);
            }
        }
        resolve(results);
    });

    /**
    * Guarda los datos de la descarga en base de datos
    * 
    */ 
    const saveDownloadInfo = (numInserts, errs) => {
        const objDownload = {
            date: date,
            executionTime: Date.now()-date.getTime(),
            numInserts,
            errs
        };        
        const download = new DownloadModel(objDownload);
        return download.save();
    };

    /**
    * Devuelve los datos de la última descarga ejecutada
    * 
    */ 
    const getLastDownload = async() => {
        const lastDownload = await DownloadModel.find().sort({ _id: -1 }).limit(1);
        return lastDownload[0];     
    };

    /**
    * Ejecuta la descarga de los partidos y los inserta en base de datos
    * 
    */ 
    const executeDownload = async() => {
        console.log("EMPIEZA DESCARGA");
        try{
            //Indica si la tarea descargará los partidos de todas las temporadas o solo de la actual 
            const downloadType = process.env.DOWNLOAD_TYPE;
            //Competiciones a descargar
            const competitionService = CompetitionService();
            const competitions = await competitionService.getIds();
            const matchService = MatchService();
            const downloadedMatches =  downloadType == "all" ? await allSeasons(competitions) : await actualSeason(competitions);
            const download = await matchService.insertMatches(downloadedMatches);                        
            await saveDownloadInfo(download.length || 0);
        }catch(e){            
            //Me quedo solo con los errores que no sean 11000, Duplicate key entry
            const errs = e.writeErrors.filter((err)=>{
                return err.code != 11000;
            })
            await saveDownloadInfo(e.insertedDocs.length || 0, errs);
        }
        console.log("TERMINA DESCARGA");
    }
    
    return Object.freeze({
       actualSeason,
       allSeasons,
       getLastDownload,
       executeDownload
    });

};

export default DownloadService;