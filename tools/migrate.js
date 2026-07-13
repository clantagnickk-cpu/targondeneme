const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const eskiServicesDir = path.join(__dirname, '../eski site/services');
const newServicesDir = path.join(__dirname, '../services');

if (!fs.existsSync(newServicesDir)) {
    fs.mkdirSync(newServicesDir);
}

const template = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <a href="../index.html" class="brand-wrapper">
                <img src="../images/targon-logo.png" alt="Targon Logo" class="brand-logo" onerror="this.style.display='none'">
                <div class="brand-text">
                    <span class="brand-name"><span class="tar">TAR</span><span class="gon">GON</span></span>
                    <span class="brand-slogan">Future-Proof Technology Works</span>
                </div>
            </a>
            <div class="mobile-toggle"><i class="fas fa-bars"></i></div>
            <ul class="nav-links">
                <li><a href="../index.html">Ana Sayfa</a></li>
                <li><a href="../services.html" class="active">Hizmetler</a></li>
                <li><a href="../about.html">Hakkımızda</a></li>
                <li><a href="../contact.html">İletişim</a></li>
            </ul>
        </div>
    </nav>

    <header class="page-header" style="padding: 180px 0 80px;">
        <div class="container reveal">
            <h1><span class="text-gradient">{{H1}}</span></h1>
        </div>
    </header>

    <section class="section-padding">
        <div class="container reveal" style="max-width: 900px; margin: 0 auto; background: rgba(10, 12, 16, 0.4); padding: 4rem; border-radius: 20px; border: 1px solid rgba(0,240,255,0.1); backdrop-filter: blur(15px);">
            {{CONTENT}}
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-bottom" style="border-top: none; padding-top: 0;">
                <p>&copy; 2026 Targon Bilgi Güvenliği Ltd. Tüm Hakları Saklıdır.</p>
            </div>
        </div>
    </footer>
    <script src="../js/main.js"></script>
</body>
</html>`;

const files = fs.readdirSync(eskiServicesDir);

for (const file of files) {
    if (!file.endsWith('.html')) continue;
    const oldContent = fs.readFileSync(path.join(eskiServicesDir, file), 'utf-8');
    const $ = cheerio.load(oldContent);
    
    const title = $('title').text();
    const introText = $('.intro-text');
    let h1 = introText.find('h1').first().text();
    if (!h1) h1 = "Hizmet Detayı";
    
    introText.find('h1').first().remove();
    const contentHtml = introText.html() || '';
    
    const newHtml = template
        .replace('{{TITLE}}', title)
        .replace('{{H1}}', h1)
        .replace('{{CONTENT}}', contentHtml);
        
    fs.writeFileSync(path.join(newServicesDir, file), newHtml, 'utf-8');
}
console.log("Services files migrated.");

// Migrate services.html
const oldServicesHtml = fs.readFileSync(path.join(__dirname, '../eski site/services.html'), 'utf-8');
const $s = cheerio.load(oldServicesHtml);

let categoriesHtml = '';
$s('.service-category').each((i, cat) => {
    const catTitle = $s(cat).find('h2.section-title').text();
    categoriesHtml += '<div class="container reveal" style="margin-bottom: 2rem;"><h2 class="section-title text-center"><span class="text-gradient">' + catTitle + '</span></h2></div>';
    categoriesHtml += '<div class="container reveal"><div class="services-grid" style="margin-bottom: 5rem;">';
    
    $s(cat).find('a.service-card').each((j, card) => {
        const link = $s(card).attr('href'); // e.g. services/kobi-bt-hizmetleri.html
        const icon = $s(card).find('.service-icon i').attr('class');
        const title = $s(card).find('h3').text();
        const desc = $s(card).find('p').text();
        
        categoriesHtml += '<a href="' + link + '" class="service-card" style="text-decoration: none;">' +
                '<div class="service-icon"><i class="' + icon + '"></i></div>' +
                '<h3 style="color: #fff;">' + title + '</h3>' +
                '<p>' + desc + '</p>' +
                '<div class="service-link">İncele <i class="fas fa-arrow-right"></i></div>' +
            '</a>';
    });
    categoriesHtml += '</div></div>';
});

const servicesTemplate = fs.readFileSync(path.join(__dirname, '../services.html'), 'utf-8');
const $newS = cheerio.load(servicesTemplate);
$newS('section.section-padding').html(categoriesHtml);
fs.writeFileSync(path.join(__dirname, '../services.html'), $newS.html(), 'utf-8');
console.log("services.html migrated.");
