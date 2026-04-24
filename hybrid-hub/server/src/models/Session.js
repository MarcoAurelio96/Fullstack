import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userEmail: { 
    type: String, 
    required: true 
  },
  sessionType: { 
    type: String, 
    enum: ['Gym', 'Cardio'], 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  exercises: [{
    // Campos comunes
    name: { type: String, required: true },
    
    // Campos de Gym
    bodyPart: { type: String, required: false },
    sets: { type: Number, required: false },
    reps: { type: Number, required: false },
    weight: { type: Number, required: false },
    
    // Campos de Cardio
    cardioType: { type: String, required: false },
    distance: { type: Number, required: false },
    duration: { type: Number, required: false },
    pace: { type: Number, required: false }
  }]
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);