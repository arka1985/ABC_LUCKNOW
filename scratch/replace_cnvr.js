import fs from 'fs';

const rootDir = 'c:/Users/arka/Rabies_Surveillance_Lucknow';

// 1. Fix index.html
try {
  let indexHtml = fs.readFileSync(`${rootDir}/index.html`, 'utf8');
  indexHtml = indexHtml
    .replace(/manage CNVR sterilization campaigns/g, 'manage Animal Birth Control (ABC) sterilization campaigns')
    .replace(/Stray Vaccination & Sterilization Register \(CNVR\) Form/g, 'Stray Vaccination & Animal Birth Control (ABC) Register')
    .replace(/stray Vaccination & CNVR register/g, 'stray Vaccination & ABC register')
    .replace(/Sterilized \(CNVR Complete\) ✅/g, 'Sterilized (ABC Complete) ✅')
    .replace(/Register vaccination & CNVR 💉/g, 'Register vaccination & ABC 💉')
    .replace(/Active Stray Sterilization \(CNVR\) Recovery Log/g, 'Active Stray Sterilization (ABC) Recovery Log')
    .replace(/Stray Dog CNVR-102/g, 'Stray Dog ABC-102')
    .replace(/Stray Dog CNVR-108/g, 'Stray Dog ABC-108');
  
  fs.writeFileSync(`${rootDir}/index.html`, indexHtml, 'utf8');
  console.log('index.html replaced CNVR with ABC!');
} catch (e) {
  console.error('Error in index.html replacement:', e);
}

// 2. Fix app.js
try {
  let appJs = fs.readFileSync(`${rootDir}/app.js`, 'utf8');
  appJs = appJs
    .replace(/cnvr_status: "Completed \(Sterilized & Vaccinated\) ✂️"/g, 'cnvr_status: "Completed (ABC Complete) ✂️"')
    .replace(/CNVR Detailed Sterilization Fields/g, 'ABC Detailed Sterilization Fields')
    .replace(/Completed \(CNVR Sterile\)/g, 'Completed (ABC Sterile)')
    .replace(/Register vaccination & CNVR 💉/g, 'Register vaccination & ABC 💉')
    .replace(/Admin Vaccination & CNVR registration Form/g, 'Admin Vaccination & ABC registration Form')
    .replace(/capturing CNVR Sterilization fields/g, 'capturing ABC Sterilization fields')
    .replace(/"Sterilized & Vaccinated \(CNVR Complete\)"/g, '"Sterilized & Vaccinated (ABC Complete)"')
    .replace(/CNVR observation list/g, 'ABC observation list')
    .replace(/Stray \$\{type === 'dog' \? 'Dog' : 'Cat'\} CNVR-\$\{newVacc\.id\}/g, 'Stray ${type === \'dog\' ? \'Dog\' : \'Cat\'} ABC-${newVacc.id}')
    .replace(/\(CNVR Complete\)/g, '(ABC Complete)')
    .replace(/\(CNVR Sterile\)/g, '(ABC Sterile)')
    .replace(/💉 CNVR File Logged/g, '💉 ABC File Logged');
  
  fs.writeFileSync(`${rootDir}/app.js`, appJs, 'utf8');
  console.log('app.js replaced CNVR with ABC!');
} catch (e) {
  console.error('Error in app.js replacement:', e);
}

// 3. Fix map.js
try {
  let mapJs = fs.readFileSync(`${rootDir}/map.js`, 'utf8');
  mapJs = mapJs
    .replace(/cnvr: "Sterilized & Vaccinated \(CNVR Complete\)"/g, 'cnvr: "Sterilized & Vaccinated (ABC Complete)"')
    .replace(/CNVR Campaign Sharda Nagar/g, 'ABC Campaign Sharda Nagar')
    .replace(/cnvr: "Completed \(Sterilized & Vaccinated\) ✂️"/g, 'cnvr: "Completed (ABC Complete) ✂️"')
    .replace(/\(CNVR Complete\)/g, '(ABC Complete)')
    .replace(/CNVR Campaign/g, 'ABC Campaign');
  
  fs.writeFileSync(`${rootDir}/map.js`, mapJs, 'utf8');
  console.log('map.js replaced CNVR with ABC!');
} catch (e) {
  console.error('Error in map.js replacement:', e);
}
