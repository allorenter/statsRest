import mongoose from 'mongoose';

const { Schema } = mongoose;

const CompetitionSchema = new Schema({
  _id: String,
  name: String,
});

export default mongoose.model('competition', CompetitionSchema);
