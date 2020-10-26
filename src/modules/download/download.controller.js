import DownloadService from './download.service';

const downloadService = DownloadService();

exports.executeDownload = async (req, res, next) => {
  try {
    downloadService.executeDownload();
    return res.status(200).json({ status: 200, message: 'Descarga iniciada' });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getLastDownload = async (req, res, next) => res.status(200).json({ status: 200, message: 'Última descarga', result: await downloadService.getLastDownload() });
