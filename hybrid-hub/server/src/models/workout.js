import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Correr', 'Andar', 'Fuerza'],
  },
  duration: {
    type: Number,
    required: true,
  },
  distance: {
    type: Number,
    required: false, 
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export const Workout = mongoose.model('Workout', workoutSchema);