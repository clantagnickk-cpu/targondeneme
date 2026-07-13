const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const rootDir = path.join(__dirname, '..');
const enDir = path.join(__dirname, '../en');

// Helper to fix links in a file
function fixFile(filePath, isEn, relativeDepth) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(content, { decodeEntities: false });
    
    // Get the filename (e.g. 'about.html')
    const fileName = path.basename(filePath);
    
    let trLink, enLink;
    
    if (!isEn) {
        // We are in the Turkish version
        if (relativeDepth === 0) {
            // Root file (e.g. index.html)
            trLink = '#';
            enLink = `en/${fileName}`;
        } else if (relativeDepth === 1) {
            // Service file (e.g. services/kobi.html)
            trLink = '#';
            enLink = `../en/services/${fileName}`;
        }
        
        $('.lang-switcher').html(`
                    <a href="${trLink}" class="active">TR</a>
                    <span>|</span>
                    <a href="${enLink}">EN</a>
        `);
    } else {
        // We are in the English version
        if (relativeDepth === 0) {
            // Root file (e.g. en/index.html)
            trLink = `../${fileName}`;
            enLink = '#';
        } else if (relativeDepth === 1) {
            // Service file (e.g. en/services/kobi.html)
            trLink = `../../services/${fileName}`;
            enLink = '#';
        }
        
        $('.lang-switcher').html(`
                    <a href="${trLink}">TR</a>
                    <span>|</span>
                    <a href="${enLink}" class="active">EN</a>
        `);
    }
    
    fs.writeFileSync(filePath, $.html(), 'utf-8');
    console.log(`Fixed lang links in: ${filePath}`);
}

// 1. Process TR Root files
const rootFiles = ['index.html', 'about.html', 'services.html', 'contact.html'];
rootFiles.forEach(f => {
    fixFile(path.join(rootDir, f), false, 0);
});

// 2. Process TR Service files
const servicesDir = path.join(rootDir, 'services');
if (fs.existsSync(servicesDir)) {
    fs.readdirSync(servicesDir).forEach(f => {
        if (f.endsWith('.html')) fixFile(path.join(servicesDir, f), false, 1);
    });
}

// 3. Process EN Root files
rootFiles.forEach(f => {
    fixFile(path.join(enDir, f), true, 0);
});

// 4. Process EN Service files
const enServicesDir = path.join(enDir, 'services');
if (fs.existsSync(enServicesDir)) {
    fs.readdirSync(enServicesDir).forEach(f => {
        if (f.endsWith('.html')) fixFile(path.join(enServicesDir, f), true, 1);
    });
}

console.log("Done fixing language switcher links!");
