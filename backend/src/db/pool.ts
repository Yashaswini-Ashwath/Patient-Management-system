import { Pool } from 'pg'; 
import dotenv from 'dotenv';


dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),  
  
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err.stack);
});







