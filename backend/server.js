require('dotenv').config();
const app = require('./src/config/app');
const { sequelize } = require('./src/models');
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established successfully.');

    // Sync models (use { alter: false } in production)
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized.');

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      console.log(`Admin API: http://${HOST}:${PORT}/api/admin`);
      console.log(`User API:  http://${HOST}:${PORT}/api/user`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();