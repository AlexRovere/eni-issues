import { Schema, model } from "mongoose";

const issueSchema = new Schema({
    auteur: { type: String, required: true },
    date: { type: Date, required: true },
    titre: { type: String, required: true },
    description: { type: String, required: true },
    etat: { type: String, required: true },
    uuid: { type: String, required: true },
    messages: { type: [String], required: true }
});

export default model("Issue", issueSchema);
