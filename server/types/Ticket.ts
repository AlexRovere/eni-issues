export type Ticket = {
  id: number,
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
