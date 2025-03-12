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

// CORS configuration to allow requests from any origin
const corsOptions = {
  origin: '*',  // Allow all origins
  credentials: true,  // Allow credentials (cookies, headers, etc.)
};

// Apply CORS middleware
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
