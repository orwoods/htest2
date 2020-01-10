const { Pool } = require('pg')

let instance;

module.exports = {
  connect: async() => {
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT
    });

    const res = await pool.query('SELECT NOW()');

    instance = pool;

    console.log(res.rows[0].now);
  },

  instance: () => {
    return instance;
  }
};