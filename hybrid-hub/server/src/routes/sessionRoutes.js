import express from 'express';
import { getSessions, saveSession } from '../controllers/sessionController.js';

const router = express.Router();

router.get('/', getSessions);
router.post('/', saveSession);

export default router;