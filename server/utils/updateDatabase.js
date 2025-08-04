const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prefixMap = {};

const init = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.resolve(__dirname, '../Mobile_Codes_India.csv'))
            .pipe(csv())
            .on('data', (rawRow) => {
                const row = Object.fromEntries(
                    Object.entries(rawRow).map(([k, v]) => [k.toLowerCase(), v])
                );
                const prefix = row.series?.trim();
                const circle = row.circle?.trim();
                if (prefix && circle) {
                    prefixMap[prefix] = circle;
                }
            })
      .on('end', () => {
                console.log('✅ Hashmap initialized');
                resolve(prefixMap);
            })
        .on('error', reject);
});
};

module.exports = { prefixMap, init };