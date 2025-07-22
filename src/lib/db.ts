import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';

const pool = mysql.createPool(process.env.DATABASE_URL || '');
export const db = drizzle(pool, { schema });

// Ensure tables exist
await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255)
  ) ENGINE=InnoDB;
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    user_id INT
  ) ENGINE=InnoDB;
`);
await pool.query(`
  CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT,
    text VARCHAR(255),
    status VARCHAR(50)
  ) ENGINE=InnoDB;
`);

export const { users, boards, items } = schema;
