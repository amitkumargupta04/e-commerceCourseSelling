
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {v2 as cloudinary} from 'cloudinary';
import fileUpload from 'express-fileupload';

import courseRoute from './routes/course.route.js';
import userRoute from './routes/user.route.js';
import adminRoute from './routes/admin.route.js';
import orderRoute from './routes/order.route.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express()
dotenv.config(); 

//middleware
app.use(express.json());
app.use(cookieParser());

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));


app.use(cors({ //connect frontend to backend
  origin: process.env.FRONTEND_URL,
  credentials: true, // allow cookies to be sent
  methods: ["GET","PUT","POST","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL;

try{
  await mongoose.connect(mongoURL);
  console.log('MongoDB connected successfully');
} catch (error) {
  console.error('MongoDB connection failed:', error);
}

// defining routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);



app.listen(port, () => {
  console.log(`server is running on ${port}`)
})

