require("dotenv").config();

module.exports = {
  local: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: "127.0.0.1",
    dialect: "postgres",
    url: process.env.DATABASE_URL,
  },
  development: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: "127.0.0.1",
    dialect: "postgres",
    url: process.env.DATABASE_URL,
  },
  test: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: "127.0.0.1",
    dialect: "postgres",
    url: process.env.TEST_DATABASE_URL,
  },
  production: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: "127.0.0.1",
    dialect: "postgres",
    url: process.env.PRODUCTION_DATABASE_URL,
    use_env_variable: "JAWSDB_URL",
  },
};
