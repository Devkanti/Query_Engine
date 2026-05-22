const fs = require('fs');
const path = require('path');

function extractText(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            extractText(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Very naive regex to find text between tags
            const matches = content.match(/>([^<]+)</g);
            if (matches) {
                const texts = matches.map(m => m.slice(1, -1).trim()).filter(t => t.length > 0 && !t.includes('{'));
                if (texts.length > 0) {
                    console.log(`\n--- ${file} ---`);
                    console.log(texts.join('\n'));
                }
            }
        }
    }
}

extractText(path.join(__dirname, '../src'));
