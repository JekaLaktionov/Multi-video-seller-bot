import { Schema, model } from 'mongoose';

interface ICounter {
  name: string;
  value: number;
}

const counterSchema = new Schema<ICounter>({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 }
});

export const Counter = model<ICounter>('Counter', counterSchema);