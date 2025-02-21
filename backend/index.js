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
import path from 'path';

dotenv.config({});

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
console.log(__dirname);

// const app = express(); // Moved above to define before usage

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin:process.env.URL ,
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


// yaha pe routes dalne hain
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", PostRoutes);
app.use("/api/v1/message", MessageRoutes);


app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})



// Start Server
server.listen(PORT, () => {
    connectDB();
    console.log("MongoDB URI:", process.env.MONGO_URI);
    console.log(`Server is running on port ${PORT}`);
});
