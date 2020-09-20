import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DownloadSchema = new Schema({
    date : Date,
    executionTime : Number,
    errs : Array,
    numInserts : Number
}); 

export default mongoose.model("downloads", DownloadSchema);