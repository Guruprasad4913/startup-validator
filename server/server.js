require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const ideaRoutes = require('./routes/ideaRoutes');
const authRoutes = require('./routes/authRoutes');
const { authenticate } = require('./routes/authRoutes');
const User = require('./models/userModel');

const app = express();
const BASE_PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/startup-idea-validator';
const MAX_PORT_RETRIES = 10;

app.use(cors());
app.use(express.json());

// Serve the frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Auth routes
app.use('/api/auth', authRoutes);

// API routes
app.use('/api/ideas', authenticate, ideaRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function listenOnPort(port, attempt = 0) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Startup Idea Validator running on http://localhost:${port}`);
      resolve(server);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && attempt < MAX_PORT_RETRIES) {
        console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
        resolve(listenOnPort(port + 1, attempt + 1));
      } else {
        reject(err);
      }
    });
  });
}

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
      await User.create({ username: adminUsername, password: adminPassword, role: 'admin' });
      console.log(`Created default admin user: ${adminUsername}`);
    }

    await listenOnPort(BASE_PORT);
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.error(`Could not start server because port ${BASE_PORT} and nearby ports are already in use.`);
    } else if (err.code === 'ECONNREFUSED') {
      console.error(`Could not connect to MongoDB at ${MONGODB_URI}. Start a local MongoDB server or set MONGODB_URI in .env to a reachable MongoDB Atlas connection string.`);
    } else {
      console.error('Startup error:', err.message || err);
    }
    process.exit(1);
  }
}

start();
