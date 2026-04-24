import { Session } from '../models/Session.js';

// GET: Obtener todo el historial de sesiones de un usuario
export const getSessions = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Falta el email del usuario" });

    // Buscamos las sesiones y las ordenamos de más nueva a más antigua
    const sessions = await Session.find({ userEmail: email }).sort({ date: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial" });
  }
};

// POST: Guardar una sesión finalizada con todos sus ejercicios
export const saveSession = async (req, res) => {
  try {
    const { userEmail, sessionType, exercises } = req.body;

    if (!userEmail || !sessionType || !exercises || exercises.length === 0) {
      return res.status(400).json({ error: "Faltan datos obligatorios para guardar la sesión" });
    }

    const newSession = new Session({
      userEmail,
      sessionType,
      exercises
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.error("❌ Error al guardar sesión:", error.message);
    res.status(400).json({ error: "Error al guardar la sesión en el historial" });
  }
};