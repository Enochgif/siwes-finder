const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const openingsRoutes = require('./routes/openings');
const applicationsRoutes = require('./routes/applications');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/openings', openingsRoutes);
app.use('/api/applications', applicationsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SIWES Finder API is running' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/siwes-finder')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    // Still start server so frontend can be tested
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (without DB)`));
  });
