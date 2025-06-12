import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import dataRoutes from './routes/dataRoutes.js';
import authRoutes from './routes/authRoutes.js';



const app = express();

// Connect to the database
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api', dataRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});