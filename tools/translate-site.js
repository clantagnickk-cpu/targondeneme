const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dict = require('./en-dict.json');
const enDir = path.join(__dirname, '../en');

function translateDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            translateDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            const html = fs.readFileSync(fullPath, 'utf-8');
            const $ = cheerio.load(html, { decodeEntities: false });
            
            // Translate title tags
            const titleText = $('title').text().trim();
            if (dict[titleText]) {
                $('title').text(dict[titleText]);
            } else {
                // Try partial translation for title if it's like "TARGON Security | Siber Güvenlik Çözümleri"
                if (titleText.includes("Siber Güvenlik Çözümleri")) {
                    $('title').text("TARGON Security | Cybersecurity Solutions");
                }
            }
            
            // Translate meta description
            const metaDesc = $('meta[name="description"]').attr('content');
            if (metaDesc && dict[metaDesc]) {
                $('meta[name="description"]').attr('content', dict[metaDesc]);
            }

            // Iterate over all text-containing elements
            $('*').contents().each((i, el) => {
                if (el.type === 'text') {
                    const originalText = el.data.trim();
                    if (originalText && dict[originalText]) {
                        // We must preserve surrounding whitespace in the HTML
                        const newText = el.data.replace(originalText, dict[originalText]);
                        el.data = newText;
                    }
                }
            });
            
            // There might be elements with nested spans like `<span class="text-gradient">Geleceğe Karşı</span>`
            // The text node inside the span will be matched and translated.
            
            fs.writeFileSync(fullPath, $.html(), 'utf-8');
            console.log(`Translated: ${fullPath}`);
        }
    }
}

translateDir(enDir);
console.log("Translation complete!");
