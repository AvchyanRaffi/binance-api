import  { Document } from 'mongoose';

export interface IAlerts extends Document {
  token: string;
  pair: string;
  min: number;
  max: number;
  userId: string;
}
