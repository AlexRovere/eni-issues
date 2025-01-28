export type Issue = {
  id: number,
  title: string,
  description: string,
  author: string,
  state: State,
  createdAt: Date,
  messages: string[]
}

export enum State {
  OPEN = 'Ouvert',
  CLOSED = 'Fermé'
}
