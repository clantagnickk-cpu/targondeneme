const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const servicesDir = path.join(rootDir, 'services');

function updateFile(filePath, prefix) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if it already has lang-switcher
    if (content.includes('class="lang-switcher"')) {
        console.log('Already updated:', filePath);
        return;
    }

    // Find the end of the nav-links ul
    const navLinksEndRegex = /<\/ul>\s*<\/div>\s*<\/nav>/;
    
    if (navLinksEndRegex.test(content)) {
        const langSwitcherHTML = `
                <li class="lang-switcher">
                    <a href="#" class="active">TR</a>
                    <span>|</span>
                    <a href="${prefix}en/index.html">EN</a>
                </li>
            </ul>
        </div>
    </nav>`;
        
        content = content.replace(navLinksEndRegex, langSwitcherHTML);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated', filePath);
    } else {
        console.log('Could not find nav-links in', filePath);
    }
}

// Update root files
const rootFiles = ['index.html', 'about.html', 'services.html', 'contact.html'];
rootFiles.forEach(f => updateFile(path.join(rootDir, f), ''));

// Update service files
if (fs.existsSync(servicesDir)) {
    const serviceFiles = fs.readdirSync(servicesDir);
    serviceFiles.forEach(f => {
        if (f.endsWith('.html')) {
            updateFile(path.join(servicesDir, f), '../');
        }
    });
}
