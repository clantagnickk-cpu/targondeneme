const fs = require('fs');
const path = require('path');

const enServicesDir = path.join(__dirname, '../en/services');

function fixPaths(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            const fullPath = path.join(dir, file);
            let content = fs.readFileSync(fullPath, 'utf-8');
            
            // In en/services/ files, asset paths like "../css/style.css" should be "../../css/style.css"
            // Let's replace href="../css/ with href="../../css/
            content = content.replace(/href="\.\.\/css\//g, 'href="../../css/');
            content = content.replace(/src="\.\.\/images\//g, 'src="../../images/');
            content = content.replace(/src="\.\.\/js\//g, 'src="../../js/');
            
            // Also fix favicon if any
            content = content.replace(/href="\.\.\/favicon/g, 'href="../../favicon');

            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Fixed paths in: ${file}`);
        }
    }
}

fixPaths(enServicesDir);
console.log("Path fixing complete!");
