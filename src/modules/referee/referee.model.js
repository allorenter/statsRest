import mongoose from 'mongoose';

const { Schema } = mongoose;

const RefereeSchema = new Schema({
  _id: String,
  name: String,
});

export default mongoose.model('referee', RefereeSchema);
