// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://churchmanagementsystem.netlify.app/login', // Replace with your real Netlify URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Not allowed by CORS'));
  },
  credentials: true,
}));

// Middleware
app.use(express.json({ type: ['application/json', 'text/plain'] }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/permissions', require('./routes/permissionRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/next-of-kin', require('./routes/nextOfKinRoutes'));
app.use('/api/member-family', require('./routes/memberFamilyRoutes'));
app.use('/api/cell-groups', require('./routes/cellGroupRoutes'));
app.use('/api/member-cell-groups', require('./routes/memberCellGroupRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/member-departments', require('./routes/memberDepartmentRoutes'));
app.use('/api/first-timers', require('./routes/firstTimerRoutes'));
app.use('/api/new-converts', require('./routes/newConvertRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/milestone-templates', require('./routes/milestoneTemplateRoutes'));
app.use('/api/milestones', require('./routes/milestoneRecordRoutes'));
app.use('/api/counseling', require('./routes/counselingRoutes'));
app.use('/api/prayer-requests', require('./routes/prayerRequestRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check
app.get('/', (req, res) => res.send('RBAC + Membership Backend Running ✅'));

module.exports = app;
