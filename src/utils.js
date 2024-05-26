const bcrypt = require("bcrypt");
const { db } = require("./db_connection");

async function hash_password(password, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds);
}

async function execute_use_database_query(databaseName) {
  const query = `USE ${databaseName}`;
  await db.query(query);
}

const is_value_numeric = (val) => {
  return !isNaN(parseInt(val)) && isFinite(val);
};

module.exports = {
  hash_password,
  execute_use_database_query,
  is_value_numeric,
};
