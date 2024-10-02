// server.js
import express from 'express';
import dbClient from './utils/db';

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Routes
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/stats', async (req, res) => {
  const users = await dbClient.nbUsers();
  const files = await dbClient.nbFiles();
  res.status(200).json({ users, files });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
