import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId,
  title: string,
  description: string,
  author: string,
  state: State,
  createdAt: Date,
  responses: string[]
}

export enum State {
  OPEN = 'Ouvert',
  CLOSED = 'Fermé'
}


const TicketSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  state: { type: String, required: true },
  createdAt: { type: Date, required: true },
  responses: { type: [], required: false },
});

export default mongoose.model<ITicket>('Tickets', TicketSchema);