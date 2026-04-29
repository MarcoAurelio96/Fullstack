import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import workoutRoutes from './routes/workoutRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import userRoutes from './routes/userRoutes.js'; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes); 
app.use('/api/sessions', sessionRoutes);

connectDB();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  });
}

export default app;