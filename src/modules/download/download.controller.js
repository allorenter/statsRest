import DownloadService from './download.service';

const downloadService = DownloadService();

exports.executeDownload = async (req, res, next) => {
  try {
    downloadService.executeDownload();
    return res.status(200).json({ status: 200, message: 'Descarga iniciada' });
  } catch (err) {
    next(err);
    return null;
  }
};

exports.getLastDownload = async (req, res) => res.status(200).json({ status: 200, message: 'Última descarga', result: await downloadService.getLastDownload() });

exports.prueba = async (req, res, next) => {
  try {
    return res.status(200).json({ status: 200, message: 'Actual season', data: await downloadService.allSeasons(['E0']) });
  } catch (err) {
    next(err);
    console.log('eoroororororoor', err);
    return null;
  }
};
