import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  height: { type: Number },
  weight: { type: Number },
}, {
  timestamps: true 
});

const User = mongoose.model('User', userSchema);
export default User;