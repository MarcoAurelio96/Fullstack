import express from 'express';
import { getSessions, saveSession, deleteSession } from '../controllers/sessionController.js';

const router = express.Router();

router.get('/', getSessions);
router.post('/', saveSession);
router.delete('/:id', deleteSession);

export default router;