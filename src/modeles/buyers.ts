import { Schema, model, Document } from 'mongoose';

export interface Ibuyer extends Document   {
  chatId:number;
  video:string;
  counter:number;
  chain:string;
  address:string;
  txHash:string;
  amount:number;
  withdrawed:Boolean;
  createdAt: Date;
}

const buyersArrSchema = new Schema<Ibuyer>({
  chatId: {
    type: Number,
    required: [true, 'Telegram ID is required'],
  },
  video:{type: String},
  counter:{type: Number},
  chain:{type: String},
  address: {
    type: String,
    required: [true, 'Wallet is required'],
  },
  txHash:{type: String},
  amount:{type: Number},
  withdrawed:{type:Boolean}
},{timestamps:true});

export const buyer = model <Ibuyer>("buyersArrSchema",buyersArrSchema)