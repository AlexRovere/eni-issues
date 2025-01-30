export interface Ticket {
  title: string;
  description: string;
  author: string;
  state: State;
  createdAt: Date;
  responses: string[];
}

export enum State {
  OPEN = 'Ouvert',
  CLOSED = 'Fermé'
}


export interface TicketWithId extends Ticket {
  _id: string;
}
