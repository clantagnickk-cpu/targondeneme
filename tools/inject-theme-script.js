const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const themeScript = `    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
            }
        })();
    </script>`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'tools') {
                processDir(fullPath);
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            // If it doesn't already contain the theme loading logic in the body
            if (!content.includes("localStorage.getItem('theme')") || !content.includes('document.body.classList.add(')) {
                const bodyRegex = /<body([^>]*)>/i;
                if (bodyRegex.test(content)) {
                    content = content.replace(bodyRegex, (match) => {
                        return match + '\n' + themeScript;
                    });
                    fs.writeFileSync(fullPath, content, 'utf-8');
                    console.log('Injected theme script into:', path.relative(rootDir, fullPath));
                }
            }
        }
    });
}

processDir(rootDir);
console.log('Theme injection process complete.');
