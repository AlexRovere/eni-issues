import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  _id: string
  titre: string
  synopsis: string
  anneeDeSortie: number
  realisateur: Realisateur
  acteurs: string[]
}

export interface Realisateur {
  nom: string
  prenom: string
}


const MovieSchema: Schema = new Schema({
  id: { type: String, require: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

export default mongoose.model<IMovie>('movies', MovieSchema);