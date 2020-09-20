import DownloadService from "./download.service";

exports.executeDownload = async function (req, res, next) {    
    try {
        const downloadService = DownloadService();
        downloadService.executeDownload();
        return res.status(200).json({ status: 200, message: "Descarga iniciada" });
    } catch (e) {
        console.log(e);        
        return res.status(400).json({ status: 400, message: e.message });
    }
}

