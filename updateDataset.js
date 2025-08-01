const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Input/output paths
const inputFile = path.join(__dirname, 'hashset_output.txt');
const outputFile = path.join(__dirname, 'mapped_prefixes.txt');

// Indian Mobile Circle dataset URL
const dataURL = 'https://raw.githubusercontent.com/api-allwin/Indian_Mobile_Circle/main/indian_mobile_circle_dataset.json';

(async () => {
  try {
    // Read prefix list from file
    const prefixes = fs.readFileSync(inputFile, 'utf-8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line); // remove empty lines

    // Fetch mobile circle dataset
    const { data: dataset } = await axios.get(dataURL);

    // Create a quick lookup map for faster search
    const lookup = {};
    dataset.forEach(entry => {
      lookup[entry.number] = entry.circle;
    });

    // Map each prefix to circle or null
    const results = prefixes.map(prefix => {
      const circle = lookup[prefix] || 'null';
      return `${prefix},${circle}`;
    });

    // Write results to output file
    fs.writeFileSync(outputFile, results.join('\n'), 'utf-8');
    console.log(`✅ Mapping complete. Saved to ${outputFile}`);
  } catch (error) {
    console.error('❌ Error occurred:', error.message);
  }
})();