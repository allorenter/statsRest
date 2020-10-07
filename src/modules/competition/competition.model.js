import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CompetitionSchema = new Schema({
    _id : String,
    name : String
}); 

export default mongoose.model("competition", CompetitionSchema);