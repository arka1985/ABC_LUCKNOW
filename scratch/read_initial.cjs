const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\\\Users\\\\arka\\\\.gemini\\\\antigravity\\\\brain\\\\e45735bb-a363-4b74-94c7-dbd4724a0e7f\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.toLowerCase().includes('map.js') && line.includes('"view_file"')) {
    try {
      const obj = JSON.parse(line);
      console.log(`Matched VIEW_FILE at Step: ${obj.step_index}, Type: ${obj.type}`);
      
      // Let's print the tool call args to see if it's viewing map.js
      let calls = [];
      if (obj.tool_calls) {
        calls = obj.tool_calls;
      } else if (obj.tool_call) {
        calls = [obj.tool_call];
      }
      
      for (const tc of calls) {
        if (tc.name === 'view_file' && tc.args.AbsolutePath && tc.args.AbsolutePath.toLowerCase().includes('map.js')) {
          console.log(`Step ${obj.step_index} viewed map.js. Let's look for the response step!`);
        }
      }
    } catch (e) {
      // Ignore
    }
  }
  
  // Also check if the line is a step containing the output of view_file for map.js
  if (line.includes('window.map') && line.includes('tileLayer') && line.includes('"status":"DONE"')) {
    try {
      const obj = JSON.parse(line);
      console.log(`Matched VIEW_FILE RESPONSE at Step: ${obj.step_index}`);
      if (obj.content) {
        const filename = `c:\\Users\\arka\\Rabies_Surveillance_Lucknow\\scratch\\map_initial_view_${obj.step_index}.js`;
        fs.writeFileSync(filename, obj.content);
        console.log(`Saved original map.js content to ${filename} (size: ${obj.content.length})`);
      }
    } catch (e) {
      // Ignore
    }
  }
});
