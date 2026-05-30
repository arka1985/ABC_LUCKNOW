const fs = require('fs');

const logPath = 'C:\\\\Users\\\\arka\\\\.gemini\\\\antigravity\\\\brain\\\\e45735bb-a363-4b74-94c7-dbd4724a0e7f\\\\.system_generated\\\\logs\\\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.step_index === 14) {
      fs.writeFileSync('c:\\Users\\arka\\Rabies_Surveillance_Lucknow\\scratch\\full_step_content_14.txt', obj.content || '');
      console.log("Saved step 14 content successfully.");
    }
    if (obj.step_index === 52) {
      fs.writeFileSync('c:\\Users\\arka\\Rabies_Surveillance_Lucknow\\scratch\\full_step_content_52.txt', obj.content || '');
      console.log("Saved step 52 content successfully.");
    }
  } catch (e) {
    // Ignore
  }
}
