require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: "127.0.0.1",
    dialect: "postgres",
    url: "//postgres:putra021825@localhost:5432/crypto_insignia_db",
  },
  test: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: "127.0.0.1",
    dialect: "postgres",
    url: "//postgres:putra021825@localhost:5432/crypto_insignia_db_test",
  },
  production: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: "crypto_insignia_db",
    host: "127.0.0.1",
    dialect: "postgres",
    url: "//postgres:putra021825@localhost:5432/crypto_insignia_db_prod",
    use_env_variable: "JAWSDB_URL",
  },
};
