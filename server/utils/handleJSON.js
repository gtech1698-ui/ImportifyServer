const fs = require('fs');
const { customError } = require('./customError');

// Expected fields
const expectedFields = [
     'category', 'mobile', 'delivery_date',
    'status', 'city', 'operator', 'state', 'circle', 'user_id'
];

function isIntegerString(str) {
    const num = parseInt(str, 10);
    return !isNaN(num) && Number.isInteger(num) && String(num) === str.trim();
}
const isValidDate = str => !isNaN(Date.parse(str));

function validateRow(row) {

    if (!isIntegerString(row.mobile) || row.mobile.trim().length !== 10) return new customError(400, 'Invalid mobile');
    if (!isValidDate(row.delivery_date)) return new customError(400, 'Invalid delivery_date');

    return null;
}

module.exports.handleJSON = async (filePath) => {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!Array.isArray(data)) throw new customError(400, 'JSON must be an array of objects');

        const validRows = [];
        for (const row of data) {
            const error = validateRow(row);
            if (error) throw error;
            validRows.push(row);
        }

        return validRows;
    } catch (err) {
        throw new customError(err.status || 500, `JSON Parse Error: ${err.message}`);
    }
};