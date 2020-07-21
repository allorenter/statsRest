import Download from "./download.model";
import {intersection} from "lodash";
import { ALLOW_COMPETITIONS } from "./download.config";

const DownloadController = () => {
    const downloadDate = new Date();
    let executionTime = 0;
    let errors = [];
    let numInserts = 0;

    //descarga los datos en formato CSV para una season y competición específica
    const downloadCsv = (season, competition) => {
        const results = [];
        return new Promise((resolve, reject) => {
            http
            .get(urlServidor + season + "/" + competition + ".csv", response => {
                response
                .pipe(csv({
                    relax_column_count: true
                }))
                .on("data", data => results.push(data))
                .on("end", () => resolve(results))
                .on("error", err => reject(err))
            })
            .on("error", err => reject(err));
        });
    }

    const onlyActualSeason = competitions => {
      
    }

    const allSeasons = (competiciones) => {

    }

    //indica el fin de la descarga de los datos
    const endDownload = () => {

    }


    return Object.freeze({

    });

}

export default DownloadController;