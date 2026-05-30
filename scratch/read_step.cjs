const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\\\Users\\\\arka\\\\.gemini\\\\antigravity\\\\brain\\\\e45735bb-a363-4b74-94c7-dbd4724a0e7f\\\\.system_generated\\\\logs\\\\transcript.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.toLowerCase().includes('map.js') && (line.includes('write_to_file') || line.includes('replace_file_content'))) {
    try {
      const obj = JSON.parse(line);
      console.log(`Matched Line at Step: ${obj.step_index}, Type: ${obj.type}`);
      
      let calls = [];
      if (obj.tool_calls) {
        calls = obj.tool_calls;
      } else if (obj.tool_call) {
        calls = [obj.tool_call];
      }
      
      for (const tc of calls) {
        const name = tc.name;
        const args = tc.args || {};
        const targetFile = args.TargetFile || '';
        
        if (targetFile.toLowerCase().includes('map.js')) {
          const content = args.CodeContent || args.ReplacementContent;
          if (content) {
            const filename = `c:\\Users\\arka\\Rabies_Surveillance_Lucknow\\scratch\\map_step_${obj.step_index}_${name}.js`;
            fs.writeFileSync(filename, content);
            console.log(`Saved ${content.length} bytes to ${filename}`);
          }
        }
      }
    } catch (e) {
      console.error("Error parsing line: " + e.message);
    }
  }
});
