require("dotenv").config();

module.exports = {
  development: {
    username: process.env.SUPABASE_USERNAME,
    password: process.env.SUPABASE_PASSWORD,
    database: process.env.SUPABASE_DATABASE,
    host: process.env.SUPABASE_HOST,
    dialect: "postgres",
    // url: process.env.DATABASE_URL,
  },
  test: {
    username: process.env.SUPABASE_USERNAME,
    password: process.env.SUPABASE_PASSWORD,
    database: process.env.SUPABASE_DATABASE,
    host: process.env.SUPABASE_HOST,
    dialect: "postgres",
    // url: process.env.TEST_DATABASE_URL,
  },
  production: {
    username: process.env.SUPABASE_USERNAME,
    password: process.env.SUPABASE_PASSWORD,
    database: process.env.SUPABASE_DATABASE,
    host: process.env.SUPABASE_HOST,
    dialect: "postgres",
    url: process.env.PRODUCTION_DATABASE_URL,
    // use_env_variable: "JAWSSUPABASE_URL",
  },
  // production: {
  //   use_env_variable: process.env.DATABASE_URL,
  //   dialect: "postgres",
  //   dialectOptions: {
  //     ssl: {
  //       require: true,
  //       rejectUnauthorized: false, // Necessary for some cloud providers
  //     },
  //   },
  // },
};
