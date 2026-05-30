const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\\\Users\\\\arka\\\\.gemini\\\\antigravity\\\\brain\\\\e45735bb-a363-4b74-94c7-dbd4724a0e7f\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('stat-active-bites') || line.includes('stat-quarantines')) {
    try {
      const obj = JSON.parse(line);
      console.log(`Matched stat counters at Step: ${obj.step_index}, Type: ${obj.type}`);
      if (obj.content) {
        const idx = obj.content.indexOf('stat-active-bites');
        console.log(obj.content.substring(idx - 100, idx + 400));
      }
    } catch (e) {
      // Ignore
    }
  }
});
