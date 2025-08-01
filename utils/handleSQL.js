const fs = require('fs');
const  customError  = require('./customError');

module.exports.handleSQL = async (filePath, db) => {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    if (!sql || sql.trim().length === 0) throw new customError(400, 'SQL file is empty');

    await db.query('START TRANSACTION');
    await db.query(sql);
    await db.query('COMMIT');
  } catch (err) {
    await db.query('ROLLBACK');
    throw new customError(err.status || 500, `SQL Execution Error: ${err.message}`);
  }
};