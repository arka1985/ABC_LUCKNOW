const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/arka/Rabies_Surveillance_Lucknow';
const files = fs.readdirSync(rootDir);

files.forEach(file => {
  if (file.endsWith('.js')) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('onFilterChange')) {
        console.log(`[${file}] Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
