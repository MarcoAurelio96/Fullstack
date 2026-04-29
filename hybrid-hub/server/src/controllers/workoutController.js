import { Workout } from '../models/workout.js';

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
    const newWorkout = new Workout(req.body);

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error("❌ Error al guardar:", error.message);
    res.status(400).json({ error: "Error al guardar el entrenamiento", detalle: error.message });
  }
};

// PUT: Actualizar un ejercicio existente (cambiar peso, marcas, etc.)
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    const workout = await Workout.findByIdAndUpdate(id, updatedData, { returnDocument: 'after' });
    
    if (!workout) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }
    
    res.status(200).json(workout);
  } catch (error) {
    console.error("❌ Error al actualizar el ejercicio:", error.message);
    res.status(500).json({ error: "Error al actualizar el ejercicio" });
  }
};

// DELETE: Borrar un ejercicio de la biblioteca
export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkout = await Workout.findByIdAndDelete(id);
    
    if (!deletedWorkout) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }
    
    res.status(200).json({ message: "Ejercicio eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al borrar el ejercicio:", error.message);
    res.status(500).json({ error: "Error al eliminar el ejercicio" });
  }
};