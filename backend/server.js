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
  origin: 'https://todo-mern-becodewala.vercel.app', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Enable cookies and authentication data
};

// Apply CORS middleware with the configured options
app.use(cors(corsOptions));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Handle preflight requests
app.options('*', cors(corsOptions));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
