import express from 'express'; 
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'https://todo-mern-becodewala.vercel.app']; 
    // Add all allowed origins here
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));  // Reject the request
    }
  },
  credentials: true,  // Allow cookies to be sent
}));

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
