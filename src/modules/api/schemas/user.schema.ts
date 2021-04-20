import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    required: true,
    default: false,
  },
})
