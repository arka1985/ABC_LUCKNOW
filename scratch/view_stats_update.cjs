const fs = require('fs');

const appPath = 'c:/Users/arka/Rabies_Surveillance_Lucknow/app.js';
const appContent = fs.readFileSync(appPath, 'utf8');

const lines = appContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('stat-active-bites') || line.includes('stat-quarantines') || line.includes('updateStats') || line.includes('refresh')) {
    console.log(`Line ${idx + 1}: ${line}`);
    for (let i = Math.max(0, idx - 2); i < Math.min(lines.length, idx + 10); i++) {
      console.log(`  [${i + 1}] ${lines[i]}`);
    }
  }
});
