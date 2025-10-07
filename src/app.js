require('dotenv').config();
const express = require('express');
const sendEmailRoutes = require('./routes/sendEmail.routes');
const webhookRoutes = require("./routes/webHook.routes");
const cors = require('cors');
const path = require('path');

const app = express();
// ⚠️ Important: Stripe webhook must come BEFORE express.json()
app.use("/api", webhookRoutes);

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/sendEmail', sendEmailRoutes);

// Redirect root to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// ✅ Export the app (Vercel uses this)
module.exports = app;
