const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\\\Users\\\\arka\\\\.gemini\\\\antigravity\\\\brain\\\\e45735bb-a363-4b74-94c7-dbd4724a0e7f\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('onFilterChange') && line.includes('function') && line.includes('"status":"DONE"')) {
    try {
      const obj = JSON.parse(line);
      console.log(`Matched onFilterChange definition at Step: ${obj.step_index}`);
      if (obj.content && obj.content.includes('onFilterChange')) {
        console.log(obj.content.substring(0, 1000));
      }
    } catch (e) {
      // Ignore
    }
  }
});
