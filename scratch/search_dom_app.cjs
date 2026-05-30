const fs = require('fs');

const appPath = 'c:/Users/arka/Rabies_Surveillance_Lucknow/app.js';
const appContent = fs.readFileSync(appPath, 'utf8');

const lines = appContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('document.getElementById') || line.includes('document.querySelector')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
