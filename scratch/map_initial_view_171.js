Created At: 2026-05-30T05:35:03Z
Completed At: 2026-05-30T05:35:03Z
File Path: `file:///c:/Users/arka/Rabies_Surveillance_Lucknow/map.js`
Total Lines: 826
Total Bytes: 36193
Showing lines 125 to 155
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
125: 
126:     // Load Voyager basemap
127:     L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
128:       maxZoom: 18,
129:     }).addTo(window.map);
130: 
131:     window.markersLayer = L.layerGroup().addTo(window.map);
132:     window.activeAlertsLayer = L.layerGroup().addTo(window.map);
133: 
134:     // Pre-loaded Lucknow ward boundary GeoJSON data loaded via script tag in index.html
135:     if (window.LUCKNOW_GEOJSON) {
136:       console.log("[GIS Map] Loaded Lucknow ward boundary GeoJSON successfully from pre-loaded script variable.");
137:       window.renderLucknowChoropleth();
138:       window.buildCascadingFilters();
139:       window.updateMapMarkers();
140:       window.renderAlertClusters();
141:       window.renderTemporalTrendLine();
142:     } else {
143:       console.warn("[GIS Map] Pre-loaded Lucknow GeoJSON boundary data not found. Initializing map fallbacks.");
144:       window.updateMapMarkers();
145:       window.renderAlertClusters();
146:       window.renderTemporalTrendLine();
147:     }
148: 
149:     // Map Dropdowns Elements
150:     const filterZoneEl = document.getElementById('filter-zone');
151:     const filterWardEl = document.getElementById('filter-ward');
152:     const filterYearEl = document.getElementById('filter-year');
153:     const filterMonthEl = document.getElementById('filter-month');
154:     const filterDateEl = document.getElementById('filter-date');
155:     const clearFiltersBtn = document.getElementById('clear-filters-btn');
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
