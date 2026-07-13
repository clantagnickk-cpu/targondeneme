const fs = require('fs');
const path = require('path');

const enDir = path.join(__dirname, '../en');

function injectTheme(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file === 'services') {
                injectTheme(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            
            // Check if already injected
            if (content.includes('class="theme-toggle"')) continue;
            
            const buttonHtml = `
                <li class="theme-toggle-li">
                    <button class="theme-toggle" aria-label="Toggle Theme">
                        <i class="fas fa-sun"></i>
                        <i class="fas fa-moon" style="display:none;"></i>
                    </button>
                </li>
            </ul>`;
            
            // Replace the closing ul tag
            content = content.replace(/<\/ul>/, buttonHtml);
            
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Injected theme toggle: ${fullPath}`);
        }
    }
}

// Inject ONLY in en directory this time (root was already done)
injectTheme(enDir);
console.log("Theme injection for EN complete!");
