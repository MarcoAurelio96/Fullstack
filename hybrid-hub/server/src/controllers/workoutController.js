import { Workout } from '../models/Workout.js';

export const getWorkouts = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Falta el email del usuario" });

    
    const workouts = await Workout.find({ userEmail: email }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los entrenamientos" });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const { userEmail, type, duration, distance } = req.body;

    const newWorkout = new Workout({
      userEmail,
      type,
      duration,
      distance
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout); 
  } catch (error) {
    res.status(400).json({ error: "Error al guardar el entrenamiento", detalle: error.message });
  }
};