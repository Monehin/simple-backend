import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

export default model('User', UserSchema);
