const fs = require('fs');
const path = require('path');

function extractAndReorderIndex(htmlFilePath) {
    let content = fs.readFileSync(htmlFilePath, 'utf-8');
    
    const gridStart = content.indexOf('<div class="services-grid reveal">');
    if (gridStart === -1) return;
    
    const gridEnd = content.indexOf('</section>', gridStart);
    if (gridEnd === -1) {
        console.log('Could not find grid end in ' + htmlFilePath);
        return;
    }
    const gridContent = content.substring(gridStart + '<div class="services-grid reveal">'.length, gridEnd);
    
    // In index.html the cards are <div class="service-card">...</div>
    const cardRegex = /(<div class="service-card">[\s\S]*?<\/div>\s*(?=<!-- Service \d -->|<div class="service-card">|$))/gi;
    let cards = [];
    let match;
    while ((match = cardRegex.exec(gridContent)) !== null) {
        cards.push(match[1]);
    }
    
    if (cards.length >= 3) {
        let newCards = [];
        newCards.push(cards.find(c => c.toLowerCase().includes('siber') || c.toLowerCase().includes('cyber')));
        newCards.push(cards.find(c => c.toLowerCase().includes('ağ') || c.toLowerCase().includes('network')));
        newCards.push(cards.find(c => c.toLowerCase().includes('kobi') || c.toLowerCase().includes('sme')));
        
        // Add any remaining cards that might exist
        cards.forEach(c => {
            if (!newCards.includes(c)) newCards.push(c);
        });

        let newGridContent = gridContent.replace(cardRegex, '%%CARD%%');
        for (let i = 0; i < newCards.length; i++) {
            newGridContent = newGridContent.replace('%%CARD%%', newCards[i]);
        }
        newGridContent = newGridContent.replace(/%%CARD%%/g, '');
        
        let newContent = content.substring(0, gridStart + '<div class="services-grid reveal">'.length) + newGridContent + content.substring(gridEnd);
        fs.writeFileSync(htmlFilePath, newContent);
        console.log(`Reordered index cards in ${htmlFilePath}`);
    } else {
        console.log('Found ' + cards.length + ' cards in ' + htmlFilePath);
    }
}

// Run
extractAndReorderIndex(path.join(__dirname, '../index.html'));
extractAndReorderIndex(path.join(__dirname, '../en/index.html'));

