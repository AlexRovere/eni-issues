import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  id: string,
  name: string;
  email: string;
}

const UserSchema: Schema = new Schema({
  id: { type: String, require: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

export default mongoose.model<IUser>('Users', UserSchema);