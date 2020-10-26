import mongoose from "mongoose";

const Schema = mongoose.Schema;

const StatSchema = new Schema({
    _id : String,
    name : String
}); 

export default mongoose.model("teams", StatSchema);