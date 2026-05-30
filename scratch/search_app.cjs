const fs = require('fs');

const appPath = 'c:/Users/arka/Rabies_Surveillance_Lucknow/app.js';
const appContent = fs.readFileSync(appPath, 'utf8');

const queries = ['clear-filters-btn', 'clearFiltersBtn', 'Reset', 'filter-zone', 'filter-ward'];
queries.forEach(query => {
  const lines = appContent.split('\n');
  let count = 0;
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes(query.toLowerCase())) {
      count++;
      if (count <= 10) {
        console.log(`[${query}] Line ${idx + 1}: ${line.trim()}`);
      }
    }
  });
  console.log(`Total mentions of '${query}': ${count}`);
  console.log('--------------------------------------------------');
});
