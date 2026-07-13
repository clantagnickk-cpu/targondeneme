const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const enDir = path.join(__dirname, '../en');
const enServicesDir = path.join(enDir, 'services');

const textsToTranslate = new Set();

function extractFromDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            extractFromDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            const html = fs.readFileSync(fullPath, 'utf-8');
            const $ = cheerio.load(html);
            
            // Extract text from specific tags
            $('h1, h2, h3, h4, p, li, a, span').each((i, el) => {
                // Get direct text only (not children)
                const text = $(el).clone().children().remove().end().text().trim();
                if (text && text.length > 2 && /[a-zA-Z]/.test(text)) {
                    textsToTranslate.add(text);
                }
            });
        }
    }
}

extractFromDir(enDir);

const output = {};
[...textsToTranslate].sort().forEach(t => {
    output[t] = "";
});

fs.writeFileSync(path.join(__dirname, 'texts.json'), JSON.stringify(output, null, 2), 'utf-8');
console.log(`Extracted ${Object.keys(output).length} unique strings to texts.json`);
