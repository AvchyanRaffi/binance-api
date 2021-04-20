import * as mongoose from 'mongoose';

export const AlertsSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  pair: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  }
})
