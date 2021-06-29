// Update with your config settings.
module.exports = {

  development: {
    client: 'postgresql',
    // connection:  'postgres://postgres:5421@postgres:5432/playGround',

    connection: {
      database: 'playGround',
      user:     'main',
      host: 'postgres',
      password: '5421'
    },
    
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    // connection: process.env.DATABASE_URL,
  //   connection: { 
  //     connectionString: process.env.DATABASE_URL,
  //     ssl: { rejectUnauthorized: false }
  // },
  connection: {
    database: 'playGround',
    user:     'postgres',
    host: 'postgres',
    password: '5421'
  },
    // connection: {
    //   user: process.env.DB_USERNAME,
    //   database: process.env.DB_DATABASE,
    //   password: process.env.DB_PASSWORD,
    //   host: process.env.DB_HOSTNAME,
    //   port: 5432,
    //   ssl: { rejectUnauthorized: false }
    // },
 
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
