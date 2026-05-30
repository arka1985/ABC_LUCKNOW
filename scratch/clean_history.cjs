const fs = require('fs');

function cleanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const cleanLines = [];
  
  let codeStarted = false;
  for (const line of lines) {
    if (!codeStarted) {
      if (line.includes('The following code has been modified') || line.includes('Showing lines')) {
        continue;
      }
      if (line.match(/^\d+:/)) {
        codeStarted = true;
      } else {
        continue;
      }
    }
    
    const match = line.match(/^\d+:\s?(.*)$/);
    if (match) {
      cleanLines.push(match[1]);
    }
  }
  return cleanLines.join('\n');
}

try {
  const clean14 = cleanFile('c:\\Users\\arka\\Rabies_Surveillance_Lucknow\\scratch\\full_step_content_14.txt');
  const clean52 = cleanFile('c:\\Users\\arka\\Rabies_Surveillance_Lucknow\\scratch\\full_step_content_52.txt');
  
  const combined = clean14 + '\n' + clean52;
  fs.writeFileSync('c:\\Users\\arka\\Rabies_Surveillance_Lucknow\\scratch\\map_original.js', combined);
  console.log("Successfully cleaned and combined original map files. Combined length:", combined.length);
} catch (e) {
  console.error("Error cleaning files:", e.message);
}
