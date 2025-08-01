const express = require('express')
const app = express()
const mysql = require('mysql2');
require('dotenv').config();
let port = 3000
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const wrapAsync = require('./utils/wrapAsync.js');
const { handleCSV } = require('./utils/handleCSV.js');
const { handleJSON } = require('./utils/handleJSON.js');
const { handleSQL } = require('./utils/handleSQL.js');
const { stringify } = require('csv-stringify');
const streamifier = require('streamifier');
const memoryUpload = multer({ storage: multer.memoryStorage() });
const csvParser = require('csv-parser');
const { logActivity } = require('./utils/activityLogger.js')
const cors = require('cors')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const { prefixMap, init } = require('./utils/updateDatabase.js');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,         // adjust based on expected load
  queueLimit: 0,
  multipleStatements: true                // unlimited queued requests
});
app.use(cors({
  origin: ['https://importify-iota.vercel.app','https://managebot.sdinc.in','*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const db = pool.promise()
console.log(db)
app.get('/', (req, res) => {
  res.send(`Working`)
})
const BATCH_SIZE = 5000;
//set used for creating new file that does not contain a code for circle
//var set = new Set()


const initAndRun = async () => {
  await init(); // Load prefixMap first
  console.log('Prefix map reloaded:', Object.keys(prefixMap).length);
  /*


  const [rows] = await db.query(
    'SELECT id, mobile FROM deliveries where circle="Null" OR circle="" or circle="N/A" or circle=NULL'
  );
  console.log(rows)
  const updates = [];

  rows.forEach(({ id, mobile }) => {
    const cleaned = (mobile || '').trim();
    const prefix = cleaned.slice(2, 6); // Skip 2-digit country code
    const circle = prefixMap[prefix];
    if (circle) {
      updates.push({ id, circle });
    }
    /* else {
       set.add(prefix)
     }
       
  });
  const data = Array.from(set).join('\n');
  fs.writeFileSync(path.join(__dirname, 'hashset_output.txt'), data, 'utf8');
  console.log('✅ HashSet values written to hashset_output.txt');

  console.log(`Matched ${updates.length} records for update ✅`);
  console.log(`Skipped ${rows.length - updates.length} rows (no prefix match) ⚠️`);

  const totalBatches = Math.ceil(updates.length / BATCH_SIZE);

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const batch = updates.slice(
      batchIndex * BATCH_SIZE,
      (batchIndex + 1) * BATCH_SIZE
    );

    const cases = batch
      .map(({ id, circle }) => `WHEN ${id} THEN '${circle}'`)
      .join(' ');
    const idList = batch.map(({ id }) => id).join(', ');

    const query = `
            UPDATE deliveries
            SET circle = CASE id
            ${cases}
            END
            WHERE id IN (${idList});
            `;

    await db.query('START TRANSACTION');
    await db.query(query);
    await db.query('COMMIT');

    console.log(`✅ Batch ${batchIndex + 1}/${totalBatches} committed`);
  }

  console.log('🚀 All batches completed.');
  */
};
initAndRun();




function overwriteCircle(rows, prefixMap) {
  rows.forEach(row => {
    const prefix = row.mobile?.slice(0, 4);
    const circleFromMap = prefixMap[prefix];

    if (circleFromMap) {
      row.circle = circleFromMap.trim();
    }
  });
}

app.post('/import/addFiles', upload.single('datafile'), wrapAsync(async (req, res) => {
  const filePath = req.file.path;
  const ext = req.file.originalname.split('.').pop();

  if (ext === 'csv') {
    try {
      const rows = await handleCSV(filePath);
      overwriteCircle(rows, prefixMap);
      const values = rows.map(row => [
        parseInt(row.id),
        row.category.trim(),
        row.mobile.trim(),
        new Date(row.delivery_date).toISOString().split('T')[0],
        row.status.trim(),
        row.city.trim(),
        row.operator.trim(),
        row.state.trim(),
        row.circle.trim(),
        parseInt(row.user_id)
      ]);

      const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
      const flattened = values.flat();

      const bulkQuery = `
        INSERT INTO deliveries
        (id, category, mobile, delivery_date, status, city, operator, state, circle, user_id)
        VALUES ${placeholders}
      `;

      await db.query('START TRANSACTION');
      await db.execute(bulkQuery, flattened);
      await db.query('COMMIT');


      const performedAt = new Date().toISOString();
      const filesize = req.file.size;
      const filename = req.file.originalname;
      await logActivity({
        db,
        activity: 'Import',
        performedAt,
        fieldnumber: rows.length,
        filename,
        filesize,
      });




      res.send(`✅ CSV Upload Successful! ${rows.length} rows inserted.`);
    } catch (err) {
      console.error(`❌ CSV Import Error: ${err.message}`);
      res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Unknown import error'
      });
    }
  }

  else if (ext === 'json') {
    try {
      const rows = await handleJSON(filePath);
      overwriteCircle(rows, prefixMap);
      const values = rows.map(row => [
        parseInt(row.id),
        row.category.trim(),
        row.mobile.trim(),
        new Date(row.delivery_date).toISOString().split('T')[0],
        row.status.trim(),
        row.city.trim(),
        row.operator.trim(),
        row.state.trim(),
        row.circle.trim(),
        parseInt(row.user_id)
      ]);

      const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
      const flattened = values.flat();

      const bulkQuery = `
      INSERT INTO deliveries
      (id, category, mobile, delivery_date, status, city, operator, state, circle, user_id)
      VALUES ${placeholders}
    `;

      await db.query('START TRANSACTION');
      await db.execute(bulkQuery, flattened);
      await db.query('COMMIT');

      const performedAt = new Date().toISOString();
      const filesize = req.file.size;
      const filename = req.file.originalname;
      await logActivity({
        db,
        activity: 'Import',
        performedAt,
        fieldnumber: rows.length,
        filename,
        filesize,
      });


      res.send(`✅ JSON Upload Successful! ${rows.length} rows inserted.`);
    } catch (err) {
      console.log(err)
      res.status(err.status || 500).send(`Import failed: ${err.message}`);
    }

  }

  else if (ext === 'sql') {
    try {
      await handleSQL(filePath, db);
      const performedAt = new Date().toISOString();
      const filesize = req.file.size;
      const filename = req.file.originalname;
      await logActivity({
        db,
        activity: 'Import',
        performedAt,
        fieldnumber: 0, // since SQL format doesn't include field count
        filename,
        filesize,
      });
      res.send(`✅ SQL Executed Successfully!`);
    } catch (err) {
      console.log(err)
      res.status(err.status || 500).send(`SQL Error: ${err.message}`);
    }

  }

  else {

    res.status(400).send('Unsupported file type');
  }
}));


app.post('/export/getFiles', wrapAsync(async (req, res) => {
  try {
    let { type, category, limit, status, circle } = req.body;
    console.log('[EXPORT] Received request with:', { type, category, limit, status, circle });

    if (!['csv', 'json'].includes(type)) {
      console.warn('[EXPORT] Invalid type:', type);
      return res.status(400).send('Invalid export type. Use csv or json');
    }

    const conditions = [];
    const values = [];

    if (!category && !status && !circle) {
      return res.status(400).send('At least one filter must be provided');
    }
    if (category) {
      conditions.push('category = ?');
      values.push(category.trim());
    }
    if (status) {
      conditions.push('status = ?');
      values.push(status.trim());
    }
    if (circle) {
      conditions.push('circle = ?');
      values.push(circle.trim());
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM deliveries ${whereClause} LIMIT ?`;
    const DEFAULT_LIMIT = 1000;
    const parsedLimit = parseInt(limit);
    values.push(Number.isNaN(parsedLimit) ? DEFAULT_LIMIT : parsedLimit);

    console.log('[EXPORT] Executing SQL:', sql);
    console.log('[EXPORT] With values:', values);

    const [rows] = await db.query(sql, values);

    if (rows.length === 0) {
      console.warn('[EXPORT] No data found for filters:', req.body);
      return res.status(404).send('No records found for the given filters.');
    }

    const fileName = `export_${Date.now()}.${type}`;
    const exportDir = path.join(__dirname, 'exports');
    const streamDirectly = (!category && !status && circle);

    const performedAt = new Date().toISOString();
    const fieldnumber= rows.length
    let filesize = null;

    if (streamDirectly) {
      console.log('[EXPORT] Using direct streaming for circle-only filter');

      if (type === 'csv') {
        const parser = new Parser();
        const csv = parser.parse(rows);
        filesize = Buffer.byteLength(csv, 'utf8');

        await logActivity({ db, activity: 'Export', performedAt, fieldnumber, filename: fileName, filesize });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(csv);
      } else {
        const json = JSON.stringify(rows, null, 2);
        filesize = Buffer.byteLength(json, 'utf8');

        await logActivity({ db, activity: 'Export', performedAt, fieldnumber, filename: fileName, filesize });

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(json);
      }
    } else {
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir);
        console.log('[EXPORT] Created exports directory');
      }

      const filePath = path.join(exportDir, fileName);

      if (type === 'csv') {
        const parser = new Parser();
        const csv = parser.parse(rows);
        filesize = Buffer.byteLength(csv, 'utf8');
        fs.writeFileSync(filePath, csv);
        console.log(`[EXPORT] CSV file created: ${fileName}`);
      } else {
        const json = JSON.stringify(rows, null, 2);
        filesize = Buffer.byteLength(json, 'utf8');
        fs.writeFileSync(filePath, json);
        console.log(`[EXPORT] JSON file created: ${fileName}`);
      }

      await logActivity({ db, activity: 'Export', performedAt, fieldnumber, filename: fileName, filesize });

      res.download(filePath, fileName, (err) => {
        if (err) console.error(`[EXPORT] Error sending ${type.toUpperCase()} file:`, err);
        else fs.unlinkSync(filePath);
      });
    }

  } catch (err) {
    console.error('[EXPORT] Unexpected error:', err);
    res.status(500).send(`Export failed: ${err.message}`);
  }
}));


app.post('/data/query', wrapAsync(async (req, res) => {
  const { category, status, limit, offset, preload = false, circle } = req.body;

  const filters = [];
  const values = [];
  if (!category && !status && !circle) {
    return res.status(400).send('At least one filter must be provided');
  }
  if (category) {
    filters.push('category = ?');
    values.push(category.trim());
  }
  if (status) {
    filters.push('status = ?');
    values.push(status.trim());
  }
  if (circle) {
    filters.push('circle = ?');
    values.push(circle.trim());
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const query = `
    SELECT id, category, mobile, delivery_date, status,
           city, operator, state, circle,
           created_at, updated_at, user_id
    FROM deliveries
    ${whereClause}
    LIMIT ? OFFSET ?
  `;

  const currentValues = [...values, parseInt(limit), parseInt(offset)];
  const [currentPage] = await db.query(query, currentValues);

  let nextPage = [];
  if (preload) {
    const nextOffset = offset + parseInt(limit);
    const nextValues = [...values, parseInt(limit), nextOffset];
    const [nextChunk] = await db.query(query, nextValues);
    nextPage = nextChunk;
  }

  const countQuery = `
    SELECT COUNT(*) AS totalCount
    FROM deliveries
    ${whereClause}
  `;
  const [countRow] = await db.query(countQuery, values);
  const totalCount = countRow[0]?.totalCount || 0;

  // 🔵 Activity Logging
  if (currentPage.length > 0) {
    const performedAt = new Date().toISOString();
    const fieldnumber = currentPage.length;
    const filename = 'N/A';
    const filesize = 0;

    await logActivity({
      db,
      activity: 'Tabular view',
      performedAt,
      fieldnumber,
      filename,
      filesize,
    });
  }

  res.json({ currentPage, nextPage, totalCount });
}));

app.post('/update-circles', memoryUpload.single('file'), wrapAsync(async (req, res) => {
  try {
    const results = [];

    streamifier.createReadStream(req.file.buffer)
      .pipe(csvParser({ headers: ['series'] }))
      .on('data', (row) => {
        const fullNumber = row.series?.trim();
        const prefix = fullNumber?.slice(0, 4); // ✂️ Extract first 4 digits

        const circle = prefixMap[prefix] || 'Not Found';
        results.push([fullNumber, circle]); // Keep original number, append resolved circle
      })
      .on('end', () => {
        stringify(results, { header: true, columns: ['series', 'circle'] }, async(err, csvOutput) => {
          if (err) {
            console.error('CSV stringify error:', err);
            return res.status(500).send('Failed to generate output CSV.');
          }
          const performedAt = new Date().toISOString();
          const filename = req.file.originalname;
          const filesize = req.file.size; // optional, feel free to include it
         const fieldnumber = results.length; // We're working with 'series' and 'circle'

          await logActivity({
            db,
            activity: 'Add circles',
            performedAt,
            fieldnumber,
            filename,
            filesize,
          });
          res.header('Content-Type', 'text/csv');
          res.attachment('updated_circles.csv');
          res.send(csvOutput);
        });
      })
      .on('error', (err) => {
        console.error('CSV parse error:', err);
        res.status(500).send('Error parsing CSV.');
      });

  } catch (err) {
    console.error('General file processing error:', err);
    res.status(500).send('Something went wrong while processing the file.');
  }
}));

app.post('/activity', wrapAsync(async (req, res) => {
  const { limit, offset, preload = false } = req.body;

  const query = `
    SELECT activity, performed_at, fieldnumber, filename, id, filesize
    FROM ActivityLogs
    ORDER BY performed_at DESC
    LIMIT ? OFFSET ?
  `;
  const currentValues = [parseInt(limit), parseInt(offset)];
  const [currentPage] = await db.query(query, currentValues);

  let nextPage = [];
  if (preload) {
    const nextOffset = offset + parseInt(limit);
    const nextValues = [parseInt(limit), nextOffset];
    const [nextChunk] = await db.query(query, nextValues);
    nextPage = nextChunk;
  }

  const countQuery = `SELECT COUNT(*) AS totalCount FROM ActivityLogs`;
  const [countRow] = await db.query(countQuery);
  const totalCount = countRow[0]?.totalCount || 0;

  res.json({ currentPage, nextPage, totalCount });
}));



// Handle unmatched routes
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});


app.use('/', (err, req, res, next) => {
  let { status = 404, message = "Bad Request" } = err
  res.status(status).send(message)
})

app.listen(port, () => {
  console.log(`App Listening at http://localhost:${port}`)
})
