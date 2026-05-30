import fs from 'fs';

const path = 'c:/Users/arka/Rabies_Surveillance_Lucknow/LUCKNOW/lucknow_ward_boundary.geojson';

try {
  const geojson = JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log('GeoJSON Type:', geojson.type);
  if (geojson.features && geojson.features.length > 0) {
    console.log('Number of features:', geojson.features.length);
    console.log('Properties of 1st feature:', JSON.stringify(geojson.features[0].properties, null, 2));
    console.log('Properties of 2nd feature:', JSON.stringify(geojson.features[1].properties, null, 2));
  } else {
    console.log('No features found!');
  }
} catch (e) {
  console.error('Error:', e);
}
