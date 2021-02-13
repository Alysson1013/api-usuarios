require('dotenv').config()

var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : process.env.DB_PASS,
      database : 'apiusers'
    }
  });

module.exports = knex