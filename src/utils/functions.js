/**
 *  Comprueba si una variable es un array y no está vacío
 *
 * @param {Array} array
 */

export const isArrayNotEmpty = (array) => Array.isArray(array) && array.length > 0;

/**
 * Valida si una temporada tiene un formato correcto
 *
 * @param {String} season
 */
export const isValidSeason = (season) => {
  const strSeason = `${season}`;
  if (typeof strSeason !== 'string' || strSeason.length !== 4) {
    return false;
  }
  const firstPart = strSeason.substr(0, 2);
  const secondPart = strSeason.substr(2);
  if (Number.isNaN(firstPart) || Number.isNaN(secondPart)) {
    return false;
  }
  return true;
};

/**
 * Convierte un año en el formato de temporaada que usaremos
 * para descargar los partidos desde el servidor
 *
 * @param {int} year
 */
// eslint-disable-next-line max-len
export const yearToSeason = (year) => (year - 1).toString().substr(2).concat(year.toString().substr(2));

/**
 * Transforma una temporada en los años que la forman
 *
 * @param {String} season
 */
export const seasonToYears = (season) => {
  if (!isValidSeason(season)) {
    return false;
  }
  const actualYear = process.env.FIRST_YEAR.toString();
  const prefix = actualYear.substr(2) < season.substr(2) ? '19' : '20';
  const seasonFirsPart = season.substr(0, 2);
  const seasonSecondPart = season.substr(2);
  const response = {
    firstYear: parseInt(prefix + seasonFirsPart, 10),
    secondYear: parseInt(prefix + seasonSecondPart, 10),
  };
  if (seasonSecondPart === '00') {
    const newPrefix = parseInt(prefix, 10) - 1;
    response.firstYear = parseInt(newPrefix + seasonFirsPart, 10);
  }
  return response;
};

/**
 * Devuelve las dos fechas entre las que se juegan los partidos de una temporada
 * Por defecto los partidos de una temporada empiezan en agosto y terminan en mayo
 * aunque puede haber temporadas que empiecen y terminen en fechas distintas a estas
 * en ese caso habría que especificarlo de alguna
 *
 * @param {String} season
 */
export const getDatesSeason = (season) => {
  if (!isValidSeason(season)) {
    return false;
  }
  const years = seasonToYears(season);
  return {
    initialDate: new Date(years.firstYear, 6, 15),
    finishDate: new Date(years.secondYear, 6, 15),
  };
};

/**
 * Convierte un String pasado por parámetros a minúsculas
 *
 * @param {String} str
 */
export const lowerCaseString = (str) => str.toLowerCase();

/**
 * Construye el filtro usado para buscar por temporada y competición
 *
 * @param {String} season
 * @param {String} competition
 */

export const getFilterSeasonCompetition = (season, competition) => {
  if (!isValidSeason(season)) {
    return false;
  }
  const datesCompetition = getDatesSeason(season);
  return {
    matchdate: {
      $gte: datesCompetition.initialDate,
      $lt: datesCompetition.finishDate,
    },
    competition,
  };
};

export const getFilterSeasonsCompetition = (seasons, competition) => {
  if (!isArrayNotEmpty(seasons)) {
    return false;
  }
  return {
    $or: seasons.map((season) => getFilterSeasonCompetition(season, competition)),
  };
};
