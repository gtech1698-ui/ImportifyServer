const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const { prefixMap, init } = require('./utils/updateDatabase.js');

const BATCH_SIZE = 10000;

const enrichCSVWithCircle = async () => {
    await init(); // Load prefixMap
    console.log(prefixMap)
    console.log(`🔄 Prefix map initialized with ${Object.keys(prefixMap).length} entries`);

    const filePath = path.join(__dirname, 'SMSDEALS_72-1.csv'); // Your actual file
    const rawCSV = fs.readFileSync(filePath, 'utf8');

    const records = parse(rawCSV, { columns: true });
    const total = records.length;
    const totalBatches = Math.ceil(total / BATCH_SIZE);

    let enriched = [];

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStart = batchIndex * BATCH_SIZE;
        const batchEnd = Math.min((batchIndex + 1) * BATCH_SIZE, total);
        const batch = records.slice(batchStart, batchEnd);

        const enrichedBatch = batch.map(row => {
            const mobile = (row.mobile || '').trim();
            const prefix = String(mobile.slice(0, 4)); // Force it to a string
            const circle = prefixMap[prefix] || null;
            if (!circle) {
                console.log(`❌ Unmatched prefix: '${prefix}' from mobile: ${mobile}`);
            }

            return { ...row, circle };
        });

        enriched.push(...enrichedBatch);
        console.log(`✅ Batch ${batchIndex + 1}/${totalBatches} enriched`);
    }

    const updatedCSV = stringify(enriched, { header: true });
    fs.writeFileSync(filePath, updatedCSV, 'utf8');

    console.log(`🎉 Finished writing enriched CSV with ${total} records to ${filePath}`);
};

enrichCSVWithCircle();