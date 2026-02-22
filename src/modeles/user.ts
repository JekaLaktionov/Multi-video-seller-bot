import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  wallet:string,
  firstName: string;
  username: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  telegramId: {
    type: Number,
    required: [true, 'Telegram ID is required'],
    unique: true,
  },
    wallet: {
    type: String,
    required: [true, 'Wallet is required'],
    unique: true,
  },
  firstName:{type: String},
  username:{type: String},
},{timestamps:true});

export const User = model <IUser>("UserSchema",userSchema)