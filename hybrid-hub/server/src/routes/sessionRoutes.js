import express from 'express';
import { getSessions, saveSession, deleteSession } from '../controllers/sessionController.js'; // <-- Añade deleteSession

const router = express.Router();

router.get('/', getSessions);
router.post('/', saveSession);
router.delete('/:id', deleteSession); // <-- NUEVA RUTA

export default router;