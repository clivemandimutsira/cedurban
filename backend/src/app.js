const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();

// Set up allowed origins dynamically based on environment
const allowedOrigins = [
  'http://localhost:3000',  // Localhost for development
  'https://churchmanagementsystem.netlify.app/',  // Replace with your actual Netlify domain
];

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));  // Block the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  credentials: true,  // Allow cookies to be sent
}));

// Ensure JSON and plain text are accepted (important for `fetch` requests)
app.use(express.json({ type: ['application/json', 'text/plain'] }));

// Static file serving for images (profile photos, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Core RBAC Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/permissions', require('./routes/permissionRoutes'));

// ✅ Membership System Routes
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/next-of-kin', require('./routes/nextOfKinRoutes'));
app.use('/api/member-family', require('./routes/memberFamilyRoutes'));
app.use('/api/cell-groups', require('./routes/cellGroupRoutes'));
app.use('/api/member-cell-groups', require('./routes/memberCellGroupRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/member-departments', require('./routes/memberDepartmentRoutes'));

// Additional Routes for other systems
app.use('/api/first-timers', require('./routes/firstTimerRoutes'));
app.use('/api/new-converts', require('./routes/newConvertRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/milestone-templates', require('./routes/milestoneTemplateRoutes'));
app.use('/api/milestones', require('./routes/milestoneRecordRoutes'));
app.use('/api/counseling', require('./routes/counselingRoutes'));
app.use('/api/prayer-requests', require('./routes/prayerRequestRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 🩺 Health check route
app.get('/', (req, res) => res.send('RBAC + Membership Backend Running ✅'));

// Serve static files in production (React Frontend build directory)
if (process.env.NODE_ENV === 'production') {
  // Set up the static folder to serve the React build files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle all routes and redirect them to the React app (single-page app routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
