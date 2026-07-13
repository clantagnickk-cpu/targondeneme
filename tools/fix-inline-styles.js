const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const enDir = path.join(__dirname, '../en');

function fixHtml(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (['services', 'en'].includes(file) || dir === enDir) {
                fixHtml(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            
            // Fix inline h3 colors
            content = content.replace(/style="color:\s*#fff;"/g, '');
            // Fix other inline colors if combined
            content = content.replace(/color:\s*#fff;/g, 'color: var(--text-main);');
            content = content.replace(/color:\s*#ffffff;/g, 'color: var(--text-main);');
            
            // Fix inline background on service pages
            content = content.replace(/background:\s*rgba\(10,\s*12,\s*16,\s*0\.4\);/g, 'background: var(--bg-card);');
            
            // Fix inline border on service pages
            content = content.replace(/border:\s*1px solid rgba\(0,240,255,0\.1\);/g, 'border: var(--border-thin);');
            content = content.replace(/border:\s*1px solid rgba\(0,\s*240,\s*255,\s*0\.1\);/g, 'border: var(--border-thin);');
            
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Cleaned inline styles in: ${fullPath}`);
        }
    }
}

fixHtml(rootDir);
console.log("HTML cleanup complete!");
