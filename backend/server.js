import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Middleware for CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173' 
    : process.env.FRONTEND_URL || 'http://localhost:5173',  // Fallback for missing FRONTEND_URL
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Handle preflight for all routes
app.options('*', cors());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
