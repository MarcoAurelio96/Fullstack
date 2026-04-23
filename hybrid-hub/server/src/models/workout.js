import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Gym', 'Cardio'], 
  },
  name: {
    type: String,
    required: true,
  },
  
  bodyPart: {
    type: String,
    enum: ['Pecho', 'Biceps', 'Triceps', 'Espalda', 'Hombro', 'Pierna'],
    required: false,
  },
  sets: { type: Number, required: false },
  reps: { type: Number, required: false },
  weight: { type: Number, required: false },


  cardioType: {
    type: String,
    enum: ['Andar', 'Correr'],
    required: false,
  },
  distance: { type: Number, required: false },
  duration: { type: Number, required: false }, // Lo hacemos opcional como pediste
  pace: { type: Number, required: false },     // Ritmo opcional

  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export const Workout = mongoose.model('Workout', workoutSchema);