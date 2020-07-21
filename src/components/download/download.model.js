import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DownloadSchema = new Schema({
    fechaInicio : Date,
    tiempoEjecucion : Number,
    errores : Array,
    numInsertados : Number
}); 

export default mongoose.model("download", DownloadSchema);