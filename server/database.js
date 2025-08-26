import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // carga las variables del .env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // ponelo en true si querés ver las queries
  }
);

export default sequelize;
