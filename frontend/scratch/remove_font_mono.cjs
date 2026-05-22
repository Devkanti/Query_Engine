const fs = require('fs');
const path = require('path');

const file = 'src/views/DashboardView.jsx';

let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\bfont-mono\b/g, '');
content = content.replace(/ {2,}/g, ' ');
content = content.replace(/className="\s+/g, 'className="');
content = content.replace(/\s+"/g, '"');

fs.writeFileSync(file, content);
console.log('Removed font-mono from DashboardView.jsx');
