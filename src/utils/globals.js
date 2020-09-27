/**
 * Dirección donde descargamos los archivos CSV con la información de los partidos
 * 
 */
export const URL_DOWNLOAD_SERVER = "http://www.football-data.co.uk/mmz4281/";

/**
 * Año de la temporada actual
 * 
 */
export const ACTUAL_YEAR = 2021;

/**
 * Competiciones disponibles para descargar en el servidor 
 * 
 */
export const ALLOW_COMPETITIONS = {
    "E0" : "Premier League" ,
    "SP1" : "Liga Española",
    "I1" : "Serie A",
    "G1" : "Superliga Griega"
};

/**
 * Columnas del CSV descargado que hay que renombrar porque tienen nombres que pueden dar problemas en JS 
 * 
 */
export const RENAME_PROPERTIES = {
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

