import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config(); // Load environment variables

const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173'  // For local development
    : process.env.FRONTEND_URL || 'https://todo-mern-becodewala.vercel.app',  // For production frontend URL
  credentials: true,  // Allow cookies/credentials in requests
};

// Apply CORS middleware to handle preflight and actual requests
app.use(cors(corsOptions));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
