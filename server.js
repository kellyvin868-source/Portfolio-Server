require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const connectDB = require('./config/db');

// Validate critical env vars
const required = ['MONGO_URI', 'JWT_SECRET'];
required.forEach(k => { if (!process.env[k]) { console.error(`Missing env var: ${k}`); process.exit(1); } });

connectDB();


const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL, /\.vercel\.app$/, /\.onrender\.com$/].filter(Boolean)
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/chat',     require('./routes/chat'));
app.use('/api/mpesa',    require('./routes/mpesa'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
