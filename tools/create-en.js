const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const enDir = path.join(rootDir, 'en');
const enServicesDir = path.join(enDir, 'services');

console.log('--- English Version Cloner ---');
console.log('This script will help you copy your TR HTML files into the /en/ folder when you are ready to translate them.');

if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir);
}
if (!fs.existsSync(enServicesDir)) {
    fs.mkdirSync(enServicesDir);
}

// Function to copy HTML files and adjust asset paths
function copyToEn(srcFile, destFile, isSubFolder = false) {
    if (!fs.existsSync(srcFile)) return;
    
    let content = fs.readFileSync(srcFile, 'utf-8');
    
    // Switch active lang to EN in the switcher
    content = content.replace('<a href="#" class="active">TR</a>', '<a href="../index.html">TR</a>');
    content = content.replace('<a href="en/index.html">EN</a>', '<a href="#" class="active">EN</a>');
    content = content.replace('<a href="../en/index.html">EN</a>', '<a href="#" class="active">EN</a>');
    
    // Fix asset paths if moving root files into /en/
    if (!isSubFolder) {
        content = content.replace(/href="css\//g, 'href="../css/');
        content = content.replace(/href="images\//g, 'href="../images/');
        content = content.replace(/src="images\//g, 'src="../images/');
        content = content.replace(/src="js\//g, 'src="../js/');
        content = content.replace(/href="favicon/g, 'href="../favicon');
    }
    
    fs.writeFileSync(destFile, content, 'utf-8');
    console.log(`Copied & Configured: ${destFile}`);
}

// Copy Root Files
const rootFiles = ['index.html', 'about.html', 'services.html', 'contact.html'];
rootFiles.forEach(f => {
    copyToEn(path.join(rootDir, f), path.join(enDir, f), false);
});

// Copy Service Files
const servicesDir = path.join(rootDir, 'services');
if (fs.existsSync(servicesDir)) {
    const serviceFiles = fs.readdirSync(servicesDir);
    serviceFiles.forEach(f => {
        if (f.endsWith('.html')) {
            // Service files are already in a subfolder, so moving to en/services/ doesn't change relative paths much,
            // except they need to point one more level up for assets if we keep strict structure, but we used ../ for services.
            // Let's just adjust active state
            copyToEn(path.join(servicesDir, f), path.join(enServicesDir, f), true);
        }
    });
}

console.log('Done! Now you can open the files in the "en" folder and translate the Turkish texts to English.');
