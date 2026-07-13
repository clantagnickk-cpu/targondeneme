const fs = require('fs');
const path = require('path');

function extractAndReorderServices(htmlFilePath) {
    let content = fs.readFileSync(htmlFilePath, 'utf-8');
    
    // We are looking for the sections in services.html
    // Each section is essentially:
    // <div class="container reveal" style="margin-bottom: 2rem;"><h2 class="section-title text-center"><span class="text-gradient">NAME</span></h2></div>
    // <div class="container reveal"><div class="services-grid" style="margin-bottom: 5rem;">...</div></div>

    // Let's use regex to extract each section.
    const sectionRegex = /(<div class="container reveal" style="margin-bottom: 2rem;">\s*<h2 class="section-title text-center"><span class="text-gradient">.*?<\/span><\/h2>\s*<\/div>\s*<div class="container reveal">\s*<div class="services-grid" style="margin-bottom: 5rem;">[\s\S]*?<\/div>\s*<\/div>)/gi;
    
    let sections = [];
    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
        sections.push(match[1]);
    }
    
    if (sections.length === 5) {
        // Reorder:
        // Current: 0: KOBI, 1: Altyapi, 2: Siber, 3: Veri, 4: Destek
        // Desired: 0: Siber, 1: Altyapi, 2: Veri, 3: KOBI, 4: Destek
        
        let newOrder = [];
        
        // Find Siber
        newOrder.push(sections.find(s => s.toLowerCase().includes('siber') || s.toLowerCase().includes('cyber')));
        // Find Altyapi
        newOrder.push(sections.find(s => s.toLowerCase().includes('ağ') || s.toLowerCase().includes('network')));
        // Find Veri
        newOrder.push(sections.find(s => s.toLowerCase().includes('veri') || s.toLowerCase().includes('data')));
        // Find KOBI
        newOrder.push(sections.find(s => s.toLowerCase().includes('kobi') || s.toLowerCase().includes('sme')));
        // Find Destek
        newOrder.push(sections.find(s => s.toLowerCase().includes('destek') || s.toLowerCase().includes('support')));
        
        // Replace all sections with a placeholder
        let newContent = content.replace(sectionRegex, '%%SECTION_PLACEHOLDER%%');
        
        // Replace placeholders with new order
        for (let i = 0; i < 5; i++) {
            newContent = newContent.replace('%%SECTION_PLACEHOLDER%%', newOrder[i]);
        }
        
        // Remove remaining placeholders if any
        newContent = newContent.replace(/%%SECTION_PLACEHOLDER%%/g, '');
        
        fs.writeFileSync(htmlFilePath, newContent);
        console.log(`Reordered services in ${htmlFilePath}`);
    } else {
        console.log(`Could not find 5 sections in ${htmlFilePath}. Found: ${sections.length}`);
    }
}

function extractAndReorderIndex(htmlFilePath) {
    let content = fs.readFileSync(htmlFilePath, 'utf-8');
    
    // In index.html, there is ONE <div class="services-grid"> with 3 <a> tags.
    const gridStart = content.indexOf('<div class="services-grid">');
    if (gridStart === -1) return;
    
    const gridEnd = content.indexOf('</div>', gridStart);
    const gridContent = content.substring(gridStart + '<div class="services-grid">'.length, gridEnd);
    
    const cardRegex = /(<a href=".*?" class="service-card"[\s\S]*?<\/a>)/gi;
    let cards = [];
    let match;
    while ((match = cardRegex.exec(gridContent)) !== null) {
        cards.push(match[1]);
    }
    
    if (cards.length === 3) {
        // Current: 0: KOBI, 1: Altyapi, 2: Siber
        // Desired: 0: Siber, 1: Altyapi, 2: KOBI
        let newCards = [];
        newCards.push(cards.find(c => c.toLowerCase().includes('siber') || c.toLowerCase().includes('cyber')));
        newCards.push(cards.find(c => c.toLowerCase().includes('ağ') || c.toLowerCase().includes('network')));
        newCards.push(cards.find(c => c.toLowerCase().includes('kobi') || c.toLowerCase().includes('sme')));
        
        let newGridContent = gridContent.replace(cardRegex, '%%CARD%%');
        for (let i = 0; i < 3; i++) {
            newGridContent = newGridContent.replace('%%CARD%%', newCards[i]);
        }
        newGridContent = newGridContent.replace(/%%CARD%%/g, '');
        
        let newContent = content.substring(0, gridStart + '<div class="services-grid">'.length) + newGridContent + content.substring(gridEnd);
        fs.writeFileSync(htmlFilePath, newContent);
        console.log(`Reordered index cards in ${htmlFilePath}`);
    }
}

// Run
extractAndReorderServices(path.join(__dirname, '../services.html'));
extractAndReorderServices(path.join(__dirname, '../en/services.html'));
extractAndReorderIndex(path.join(__dirname, '../index.html'));
extractAndReorderIndex(path.join(__dirname, '../en/index.html'));

