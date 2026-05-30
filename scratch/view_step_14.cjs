const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\\\Users\\\\arka\\\\.gemini\\\\antigravity\\\\brain\\\\e45735bb-a363-4b74-94c7-dbd4724a0e7f\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.step_index === 14) {
      console.log(`\n==================================================`);
      console.log(`STEP: ${obj.step_index} | TYPE: ${obj.type} | STATUS: ${obj.status}`);
      console.log(`==================================================`);
      if (obj.content) {
        console.log("Content Length: " + obj.content.length);
        const preview = obj.content.substring(0, 500);
        console.log("Content Preview: " + preview);
        if (obj.content.length > 5000) {
          const filename = `c:\\Users\\arka\\Rabies_Surveillance_Lucknow\\scratch\\full_step_content_${obj.step_index}.txt`;
          fs.writeFileSync(filename, obj.content);
          console.log(`Saved full content to ${filename}`);
        }
      }
    }
  } catch (e) {
    // Ignore
  }
});
