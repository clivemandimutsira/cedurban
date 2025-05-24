require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');

const app = require('./src/app');
const { init } = require('./src/sockets/websocket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// ▶️ Initialize Socket.IO
init(server);

// ▶️ Serve React static files
const clientBuildPath = path.join(__dirname, 'build'); // Make sure `build` is in the root
app.use(express.static(clientBuildPath));

// ▶️ React Router fallback for all non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next(); // let API routes pass through
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ▶️ Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Start cron jobs / schedulers
  require('./src/scheduler/memberStatusScheduler');
  require('./src/scheduler/cron');
});
