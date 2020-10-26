import mongoose from 'mongoose';

const { Schema } = mongoose;

const DownloadSchema = new Schema({
  date: Date,
  executionTime: Number,
  numInserts: Number,
  errs: Array,
});

export default mongoose.model('downloads', DownloadSchema);
