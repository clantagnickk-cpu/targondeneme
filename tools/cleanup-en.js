const fs = require('fs');
const path = require('path');

const enDir = path.join(__dirname, '../en');

function cleanupDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            cleanupDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let html = fs.readFileSync(fullPath, 'utf-8');
            
            // Clean up remaining words
            html = html.replace(/İncele/g, 'Learn More');
            html = html.replace(/Gönder/g, 'Send');
            html = html.replace(/Siber Güvenlik Merkezi/g, 'Cybersecurity Center');
            html = html.replace(/İletişim Sayfası/g, 'Contact Page');
            
            // Fix titles
            html = html.replace(/<title>.* - TARGON<\/title>/g, (match) => {
                if (match.includes("Zafiyet Taraması")) return "<title>Vulnerability Scanning & Security Tests - TARGON</title>";
                if (match.includes("Yazılım Lisans")) return "<title>Software License Management - TARGON</title>";
                if (match.includes("Kurumsal Ağ")) return "<title>Enterprise Network & Infrastructure - TARGON</title>";
                if (match.includes("KOBİ'lere")) return "<title>SMB IT Services - TARGON</title>";
                if (match.includes("Firewall")) return "<title>Firewall & Security Solutions - TARGON</title>";
                if (match.includes("Eğitim")) return "<title>Cybersecurity Training - TARGON</title>";
                if (match.includes("EDR")) return "<title>EDR & Endpoint Security - TARGON</title>";
                if (match.includes("Active Directory")) return "<title>Active Directory & Identity Management - TARGON</title>";
                return match;
            });
            html = html.replace(/<title>İletişim \| TARGON Security<\/title>/g, '<title>Contact | TARGON Security</title>');
            
            // Fix meta descriptions
            html = html.replace(/Targon Security ile geleceğe hazır teknoloji. KOBİ BT Hizmetleri, MDR, XDR, SIEM, SOC, Penetrasyon Testi ve Siber Güvenlik Danışmanlığı./g, 
                "Future-proof technology with Targon Security. SMB IT Services, MDR, XDR, SIEM, SOC, Penetration Testing, and Cybersecurity Consulting.");
            html = html.replace(/Targon Security hizmetleri: KOBİ BT Hizmetleri, MDR, XDR, SIEM, SOC, Penetrasyon Testi, KVKK ve ISO 27001 Danışmanlığı./g, 
                "Targon Security services: SMB IT Services, MDR, XDR, SIEM, SOC, Penetration Testing, KVKK and ISO 27001 Consulting.");
            html = html.replace(/Targon Security ile iletişime geçin. MDR, XDR, SIEM, SOC danışmanlığı için bize ulaşın./g, 
                "Get in touch with Targon Security. Contact us for MDR, XDR, SIEM, and SOC consulting.");
            html = html.replace(/Targon Security hakkında: Ankara merkezli siber güvenlik, MDR, XDR, SIEM, SOC, Red Team, Blue Team danışmanlığı./g, 
                "About Targon Security: Ankara-based cybersecurity, MDR, XDR, SIEM, SOC, Red Team, and Blue Team consulting.");

            // Fix the Microsoft 365 line
            html = html.replace(/Microsoft <span class="numeral">365<\/span>, Google Workspace gibi kurumsal bulut çözümleriyle/g, 
                "Microsoft <span class=\"numeral\">365</span>, Google Workspace and other corporate cloud solutions");
                
            fs.writeFileSync(fullPath, html, 'utf-8');
            console.log(`Cleaned: ${fullPath}`);
        }
    }
}

cleanupDir(enDir);
console.log("Cleanup complete!");
