require('dotenv').config();
const app = require('./src/config/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established successfully.');

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: false });
      console.log('Database models synchronized.');
    } else {
      console.log('Database sync skipped. Set DB_SYNC=true to enable Sequelize sync.');
    }

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
