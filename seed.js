require('dotenv').config();
const mongoose = require('mongoose');
const Admin    = require('./models/Admin');
const Project  = require('./models/Project');
const connectDB = require('./config/db');

const projects = [
  { title: 'Church CMS System', description: 'Full-stack church management system with prayer requests, member registration, announcements, and admin dashboard.', techStack: ['Node.js','Express','MongoDB','JavaScript'], githubLink: 'https://github.com/kelvinkemboi/church-cms', liveDemo: '' },
  { title: 'Student Record System', description: 'Secure login system for managing student courses and academic records with role-based access.', techStack: ['Node.js','Express','MongoDB','JWT'], githubLink: 'https://github.com/kelvinkemboi/student-records', liveDemo: '' },
  { title: 'Library Management System', description: 'Borrow and return books system with admin dashboard for managing inventory and members.', techStack: ['Node.js','Express','MongoDB'], githubLink: 'https://github.com/kelvinkemboi/library-system', liveDemo: '' },
  { title: 'M-Pesa Easy SDK', description: 'Simplified Node.js SDK for Safaricom Daraja API — STK push, token generation, and callback handling.', techStack: ['Node.js','Axios','Daraja API'], githubLink: 'https://github.com/kelvinkemboi/mpesa-easy-sdk', liveDemo: '' }
];

(async () => {
  await connectDB();
  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log('✓ Projects seeded');

  await Admin.deleteMany({});
  await Admin.create({ username: 'kelvin', email: 'kelvin@portfolio.com', password: 'Admin@1234' });
  console.log('✓ Admin created — kelvin@portfolio.com / Admin@1234');
  mongoose.disconnect();
})();
