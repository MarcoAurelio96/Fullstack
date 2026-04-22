import { Router } from 'express';
import { getWorkouts, createWorkout } from '../controllers/workoutController.js';

const router = Router();

router.get('/', getWorkouts);

router.post('/', createWorkout);

export default router;