import express, { urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';


dotenv.config({});

const app = express(); // Moved above to define before usage

const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello from backend",
        success: true,
    
    });
});


// Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
