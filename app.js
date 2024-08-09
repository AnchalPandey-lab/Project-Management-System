import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv'


// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB with Mongoose
mongoose.connect(process.env.URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Connect to MongoDB with MongoClient
const client = new MongoClient(process.env.URI);
let db;
client.connect()
    .then(() => {
        db = client.db('sample_mflix');
        console.log('MongoClient connected');
    })
    .catch(err => console.log(err));

// Middleware to attach the database to the request object
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Example route using MongoClient
app.get('/api/movie', async (req, res) => {
    try {
        const movies = req.db.collection('movies');
        const query = { title: 'Back to the Future' };
        const movie = await movies.findOne(query);
        res.json(movie);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));