const fs = require('fs');
const path = require('path');

const dir = 'src';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove uppercase and tracking classes
  content = content.replace(/\buppercase\b/g, '');
  content = content.replace(/\btracking-widest\b/g, '');
  content = content.replace(/\btracking-\[0\.2em\]\b/g, '');
  content = content.replace(/\btracking-wider\b/g, '');
  
  // Clean up multiple spaces that might have been created
  content = content.replace(/ {2,}/g, ' ');
  content = content.replace(/className="\s+/g, 'className="');
  content = content.replace(/\s+"/g, '"');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function traverse(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

traverse(dir);
console.log("Done");
