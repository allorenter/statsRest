import {mapKeys} from "lodash";
import {RENAME_PROPERTIES} from "./globals";

/**
 * Renombra algunas de las claves de las columnas del CSV descargado porque tienen nombres que pueden dar problemas con JS 
 * 
 */
export const renameKeys = objMatch => mapKeys(objMatch, (value, key) => RENAME_PROPERTIES[key] || key );

