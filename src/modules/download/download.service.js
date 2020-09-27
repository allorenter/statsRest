import DownloadModel from "./download.model";
import MatchService from "../match/match.service";
import {URL_DOWNLOAD_SERVER, ACTUAL_YEAR, ALLOW_COMPETITIONS} from "../../utils/globals";
import {renameKeys} from "../../utils/functions";
import csv from "csv-parser";
import http from "http";

const DownloadService = () => {

    const date = new Date;

    /**
    * Descarga los datos en formato CSV de una competición en una temporada
    * 
    */ 
    const downloadCsv = (year, competition) => new Promise((resolve, reject) => {
        try{
            //Genera un string con el formato correcto de la temporada que hay que usar para descargar el CSV 
            const season = (year-1).toString().substr(2).concat(year.toString().substr(2)); 
            const results = [];
            http.get(URL_DOWNLOAD_SERVER + season + "/" + competition + ".csv", response => {
                response
                .pipe(csv())
                .on("data", data => {results.push(renameKeys(data))})
                .on("end", () => resolve(results))
                .on("error", err => reject(err))
            }).on("error", err => reject(err));
        }catch(e){
            console.log("ERROR EN LA DESCARGA", e);
        }
        
    });
    
    /**
    * Descarga los partidos de la temporada actual para las competiciones especificadas
    * 
    */ 
    const actualSeason = (competitions) => new Promise(async (resolve, reject) => {        
        const results = [];
        for(const competition of competitions){
            console.log(`DESCARGA: ${competition} / ${ACTUAL_YEAR}`);
            const matches = await downloadCsv(ACTUAL_YEAR, competition);
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
            for(let year = firstYear; year <= ACTUAL_YEAR; year++ ){
                console.log(`DESCARGA: ${competition} / ${year}`);
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
            const competitions = Object.keys(ALLOW_COMPETITIONS);
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