import express, { urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import UserRoutes from './routes/user.route.js';
import PostRoutes from './routes/post.route.js';

import MessageRoutes from './routes/message.route.js';
import userRoute from "./routes/user.route.js";
// import postRoute from "./routes/post.route.js";
// import messageRoute from "./routes/message.route.js";
import { app ,server} from './socket/socket.js';

dotenv.config({});

// const app = express(); // Moved above to define before usage

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


// yaha pe routes dalne hain
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", PostRoutes);
app.use("/api/v1/message", MessageRoutes);




// Start Server
server.listen(PORT, () => {
    connectDB();
    console.log("MongoDB URI:", process.env.MONGO_URI);
    console.log(`Server is running on port ${PORT}`);
});
