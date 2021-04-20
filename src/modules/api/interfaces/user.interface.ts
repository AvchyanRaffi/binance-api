import  {Document} from 'mongoose';

export interface IUser extends Document {
  token: string;
  enabled: boolean;
}
