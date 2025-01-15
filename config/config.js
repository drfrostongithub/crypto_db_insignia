require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    // url: process.env.DATABASE_URL,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    // url: process.env.TEST_DATABASE_URL,
  },
  // production: {
  //   username: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  //   host: process.env.DB_HOST,
  //   dialect: "postgres",
  //   // url: process.env.PRODUCTION_DATABASE_URL,
  //   // use_env_variable: "JAWSDB_URL",
  // },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Necessary for some cloud providers
      },
    },
  },
};
