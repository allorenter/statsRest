import DownloadService from './download.service';
import succesResponse from '../../utils/response';

const downloadService = DownloadService();

exports.executeDownload = async (req, res, next) => {
  try {
    downloadService.executeDownload();
    return succesResponse(res, 'Descarga Iniciada', {});
  } catch (err) {
    next(err);
    return null;
  }
};

exports.getLastDownload = async (req, res, next) => {
  try {
    return succesResponse(res, 'Última descarga', await downloadService.getLastDownload());
  } catch (err) {
    next(err);
    return null;
  }
};
