const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\arka\\.gemini\\antigravity\\brain\\e45735bb-a363-4b74-94c7-dbd4724a0e7f\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error("Log file not found at " + logPath);
  process.exit(1);
}

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let foundCount = 0;
rl.on('line', (line) => {
  if (line.includes('"TargetFile"') && line.includes('map.js') && (line.includes('window.map') || line.includes('L.map') || line.includes('tileLayer'))) {
    try {
      const obj = JSON.parse(line);
      console.log(`\n==================================================`);
      console.log(`STEP: ${obj.step_index} | TYPE: ${obj.type} | SOURCE: ${obj.source}`);
      console.log(`==================================================`);
      
      // If it's a tool call to write_to_file or replace_file_content, let's print the relevant fields
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'write_to_file' || tc.name === 'replace_file_content') {
            const args = tc.args || {};
            console.log(`Tool Call: ${tc.name} for ${args.TargetFile}`);
            if (args.CodeContent) {
              console.log(`--- CodeContent (length: ${args.CodeContent.length}) ---`);
              console.log(args.CodeContent.substring(0, 1500) + "\n...[TRUNCATED]...");
            }
            if (args.ReplacementContent) {
              console.log(`--- ReplacementContent ---`);
              console.log(args.ReplacementContent.substring(0, 1500) + "\n...[TRUNCATED]...");
            }
          }
        }
      }
      foundCount++;
    } catch (e) {
      // JSON parse error or property access error
    }
  }
});

rl.on('close', () => {
  console.log(`\nSearch complete. Found ${foundCount} matching steps.`);
});
