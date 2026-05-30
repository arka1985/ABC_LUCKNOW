// GIS Map Module - Rabies Surveillance System ("Benign Canine")
// Localized & Optimized for Lucknow Municipality
// Conceptualised & Developed by Dr. Arkaprabha Sau and Prof. Manish Kumar Singh

// Global scope initialization
window.map = null;
window.geojsonLayer = null;
window.markersLayer = null;
window.activeAlertsLayer = null;
window.LUCKNOW_GEOJSON = null;

// Mock database of active surveillance data inside Lucknow Municipality
window.SURVEILLANCE_DATABASE = {
  biteCases: [
    { id: 101, reporter: "Preeti Sharma", animal: "dog", lat: 26.8467, lng: 80.9462, date: "2026-05-26", severity: "Category III", behavior: "Aggressive / Salivating", description: "Aggressive street dog near Hazratganj crossing bit my leg.", phone: "9876543210", status: "Active", zone: "1", ward: "Hazratganj" },
    { id: 102, reporter: "Rohan Das", animal: "dog", lat: 26.7640, lng: 80.9160, date: "2026-05-27", severity: "Category II", behavior: "Aggressive / Salivating", description: "Brown stray dog bit a vegetable vendor in Sharda Nagar market.", phone: "9830012345", status: "Active", zone: "5", ward: "Sharda Nagar" },
    { id: 103, reporter: "Aniket Sen", animal: "cat", lat: 26.7910, lng: 80.8860, date: "2026-05-25", severity: "Category II", behavior: "Sick / Lethargic", description: "Stray white kitten scratched child near Hind Nagar park.", phone: "9123456789", status: "Active", zone: "5", ward: "Hind Nagar" },
    { id: 104, reporter: "S. Bajpai", animal: "dog", lat: 26.8530, lng: 80.9990, date: "2026-05-28", severity: "Category III
      else counts[4]++;
    });
    chartColor = '#10b981'; // Green for CNVR Sterile
    chartLabel = 'Sterilizations';
  }

  // SVG parameters
  const width = 290;
  const height = 90;
  const paddingX = 20;
  const paddingY = 15;
  
  const roundedCounts = counts.map(c => Math.round(c * 10) / 10);
  const maxVal = Math.max(...roundedCounts, 3); // minimum scale index of 3
  
  const points = roundedCounts.map((val, idx) => {
    const x = paddingX + (idx * (width - 2 * paddingX) / (counts.length - 1));
    const y = height - paddingY - (val * (height - 2 * paddingY) / maxVal);
    return { x, y, val };
  });

  // Draw smooth cubic bezier curves
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpX1 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
    const cpY1 = points[i-1].y;
    const cpX2 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
    const cpY2 = points[i].y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
  }

  // Generate interactive node circles and labels
  let nodesHtml = '';
  points.forEach((pt, idx) => {
    nodesHtml += `
      <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="${chartColor}" stroke="white" stroke-width="2" style="cursor: pointer;">
        <title>Week ${idx+1} ${chartLabel}: ${pt.val}</title>
      </circle>
      <text x="${pt.x}" y="${height - 2}" font-size="7" font-weight="800" fill="#475569" text-anchor="middle">W${idx+1}</text>
      <text x="${pt.x}" y="${pt.y - 7}" font-size="7.5" font-weight="800" fill="${chartColor}" text-anchor="middle">${pt.val}</text>
    `;
    `;
  });

  canvas.innerHTML = `
    <svg class="trend-svg" viewBox="0 0 ${width} ${height}">
      <!-- Gradient Fill under path -->
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${chartColor}" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="${chartColor}" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      
      <!-- Area fill path -->
      <path d="${pathD} L ${points[points.length-1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z" fill="url(#chartGrad)"/>
      
      <!-- Stroke trendline path -->
      <path d="${pathD}" fill="none" stroke="${chartColor}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      
      <!-- Horizontal Baseline -->
      <line x1="${points[0].x}" y1="${height - paddingY}" x2="${points[points.length-1].x}" y2="${height - paddingY}" stroke="rgba(0,0,0,0.06)" stroke-width="1.5"/>
      
      <!-- Interactive nodes -->
      ${nodesHtml}
    </svg>
  `;
};
