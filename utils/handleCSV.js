const fs = require('fs');
const { parse } = require('csv-parse');
const customError = require('./customError');

// Expected schema columns
const expectedColumns = [
  'category', 'mobile', 'delivery_date',
  'status', 'operator', 'circle'
];

// Helper to check if string is an integer
function isIntegerString(str) {
  const num = parseInt(str, 10);
  return !isNaN(num) && Number.isInteger(num) && String(num) === str.trim();
}

// Helper to validate date format
const isValidDate = (str) => !isNaN(Date.parse(str));

// Central row validation function
function validateRow(row) {
  const requiredFields = [
    'category', 'mobile', 'delivery_date',
    'status', 'operator', 'circle'
  ];

  for (const field of requiredFields) {
    if (!row[field]?.trim()) {
      return new customError(404, `Schema validation failed: "${field}" is missing or empty`);
    }
  }
  console.log(row.mobile)
  if (!isIntegerString(row.mobile) || row.mobile.trim().length !== 10) {
    return new customError(400, 'Schema validation failed: "mobile" must be a 10-digit integer');
  }
  if (!isValidDate(row.delivery_date)) {
    return new customError(400, 'Schema validation failed: "delivery_date" is not a valid date format');
  }
  return null; // No error, row is valid
}

// Main CSV handler
module.exports.handleCSV = async (filePath) => {
  const validRows = [];
  const errors = [];

 return new Promise((resolve, reject) => {
  fs.createReadStream(filePath)
  .pipe(parse({
    columns: header => header.map(h => h.trim().replace(/\uFEFF/g, '')),
    skip_empty_lines: true,
    trim: true
  }))
    .on('headers', headers => {
      const missing = expectedColumns.filter(col => !headers.includes(col));
      if (missing.length) reject(new customError(404, `Missing Columns: ${missing.join(', ')}`));
    })
    .on('data', row => {
      if (Object.values(row).every(val => !val?.trim())) return;
      const error = validateRow(row);
      if (error) errors.push(error);
      else validRows.push(row);
    })
    .on('end', () => {
      if (errors.length) reject(errors[0]);
      else resolve(validRows);
    })
    .on('error', err => reject(new customError(500, `CSV Parse Error: ${err.message}`)));
});
};
