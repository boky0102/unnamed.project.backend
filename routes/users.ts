/*Here are all the endpoints related to Users
with an order of GET, POST, PATCH, DELETE*/
import { Pool } from 'pg'
import { Router } from "express";
require('dotenv').config();

export const userController = Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

//get request for Users
userController.use('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."Users";');
    const users = result.rows;
    client.release();
    res.json(users);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


