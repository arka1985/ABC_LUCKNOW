const fs = require('fs');

const cssPath = 'c:/Users/arka/Rabies_Surveillance_Lucknow/styles.css';
const cssContent = fs.readFileSync(cssPath, 'utf8');

const lines = cssContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('app-main')) {
    console.log(`Line ${idx + 1}: ${line}`);
    for (let i = Math.max(0, idx - 3); i < Math.min(lines.length, idx + 10); i++) {
      console.log(`  [${i + 1}] ${lines[i]}`);
    }
  }
});
