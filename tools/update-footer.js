const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const servicesDir = path.join(rootDir, 'services');

const getFooter = (prefix) => `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 3rem;">
                <div class="footer-about">
                    <a href="${prefix}index.html" class="brand-wrapper" style="margin-bottom: 1rem;">
                        <div class="brand-text">
                            <span class="brand-name" style="font-size: 1.5rem;"><span class="tar">TAR</span><span class="gon">GON</span></span>
                        </div>
                    </a>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Targon Bilgi Güvenliği Ltd. olarak, işletmelerin dijital çağda güvende kalması için yenilikçi ve proaktif çözümler sunuyoruz.</p>
                    <div class="social-links" style="display: flex; gap: 1rem;">
                        <a href="https://www.linkedin.com/company/targon" target="_blank" style="font-size: 1.2rem;"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                
                <div class="footer-links" style="display: flex; flex-direction: column; gap: 1rem;">
                    <h4 style="color: #fff; margin-bottom: 0.5rem;">Hızlı Menü</h4>
                    <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                        <li><a href="${prefix}index.html">Ana Sayfa</a></li>
                        <li><a href="${prefix}services.html">Hizmetlerimiz</a></li>
                        <li><a href="${prefix}about.html">Hakkımızda</a></li>
                        <li><a href="${prefix}contact.html">İletişim</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom" style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 2rem; text-align: center;">
                <p style="color: var(--text-muted); font-size: 0.9rem;">&copy; 2026 Targon Bilgi Güvenliği Ltd. Tüm Hakları Saklıdır.</p>
            </div>
        </div>
    </footer>`;

function updateFile(filePath, prefix) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');
    const footerRegex = /<footer class="footer">[\s\S]*?<\/footer>/;
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, getFooter(prefix).trim());
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated', filePath);
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
