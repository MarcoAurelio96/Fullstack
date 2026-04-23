import { Workout } from '../models/Workout.js';

// GET: Obtener los entrenamientos
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

// POST: Guardar un nuevo entrenamiento
export const createWorkout = async (req, res) => {
  try {
    // NUEVO: En lugar de sacar campo por campo, le pasamos a MongoDB 
    // absolutamente todo lo que nos envíe React en el 'body'
    const newWorkout = new Workout(req.body);

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error("❌ Error al guardar:", error.message); // Por si falla, lo veremos en la terminal
    res.status(400).json({ error: "Error al guardar el entrenamiento", detalle: error.message });
  }
};