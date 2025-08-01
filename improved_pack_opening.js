// Improved pack opening functionality

/**
 * Opens a pack and adds cards to the player's collection
 * @param {string} packType - The type of pack to open
 * @returns {boolean} - Whether the pack was successfully opened
 */
function openPack(packType) {
    console.log(`Attempting to open ${packType} pack...`);
    
    // Check if the player has the pack
    if (!gameState.player.sealedInventory[packType] || gameState.player.sealedInventory[packType] <= 0) {
        logMessage(`You don't have any ${TCG_SETS[packType].name} packs to open.`, "error");
        return false;
    }
    
    // Remove from inventory
    gameState.player.sealedInventory[packType]--;
    
    // Generate cards
    const cards = generatePackCards(TCG_SETS[packType]);
    
    // Show opening animation/transition
    showPackOpeningAnimation(packType, cards)
        .then(() => {
            // Add cards to collection
            const addedCards = cards.map(card => {
                const instance = addCardToCollection(card);
                return { card, instance };
            });
            
            // Update stats
            gameState.stats.packsOpened++;
            
            // Log message
            logMessage(`Opened a ${TCG_SETS[packType].name} pack and got ${cards.length} cards!`, "system");
            
            // Show results
            showPackResults(addedCards);
            
            // Update UI
            updateUI();
            
            // Re-render the collection view
            renderMainView('collection');
        });
    
    return true;
}

/**
 * Shows an animation for opening a pack
 * @param {string} packType - The type of pack being opened
 * @param {Array} cards - The cards in the pack
 * @returns {Promise} - Resolves when animation is complete
 */
function showPackOpeningAnimation(packType, cards) {
    return new Promise((resolve) => {
        // Create a modal overlay for the animation
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        
        // Create the animation container
        const container = document.createElement('div');
        container.className = 'bg-gray-900 p-8 rounded-lg max-w-lg w-full text-center';
        
        // Add pack image
        const packImg = document.createElement('img');
        packImg.src = TCG_SETS[packType].pack.img;
        packImg.alt = `${TCG_SETS[packType].name} Pack`;
        packImg.className = 'w-48 h-auto mx-auto mb-4 transform transition-transform duration-1000';
        container.appendChild(packImg);
        
        // Add opening text
        const openingText = document.createElement('h2');
        openingText.className = 'text-xl font-bold text-white mb-4';
        openingText.textContent = 'Opening Pack...';
        container.appendChild(openingText);
        
        // Add progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'w-full bg-gray-700 rounded-full h-2.5 mb-4';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'bg-blue-600 h-2.5 rounded-full transition-all duration-1000';
        progressBar.style.width = '0%';
        
        progressContainer.appendChild(progressBar);
        container.appendChild(progressContainer);
        
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        // Animate the pack opening
        setTimeout(() => {
            packImg.style.transform = 'scale(1.1) rotate(5deg)';
            progressBar.style.width = '30%';
        }, 300);
        
        setTimeout(() => {
            packImg.style.transform = 'scale(1.2) rotate(-5deg)';
            progressBar.style.width = '60%';
        }, 800);
        
        setTimeout(() => {
            packImg.style.transform = 'scale(1.3) rotate(0deg)';
            progressBar.style.width = '100%';
            openingText.textContent = 'Pack Opened!';
        }, 1300);
        
        // Remove the animation and resolve the promise
        setTimeout(() => {
            document.body.removeChild(overlay);
            resolve();
        }, 2000);
    });
}

/**
 * Shows the results of opening a pack
 * @param {Array} addedCards - The cards added to the collection
 */
function showPackResults(addedCards) {
    // Create a modal overlay for the results
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    
    // Create the results container
    const container = document.createElement('div');
    container.className = 'bg-gray-900 p-8 rounded-lg max-w-4xl w-full';
    
    // Add results header
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6';
    
    const title = document.createElement('h2');
    title.className = 'text-xl font-bold text-white';
    title.textContent = 'Pack Results';
    header.appendChild(title);
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    header.appendChild(closeBtn);
    
    container.appendChild(header);
    
    // Add card grid
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4';
    
    // Add cards to grid
    addedCards.forEach(({ card, instance }) => {
        const cardElement = buildCardElement(card, instance);
        cardElement.classList.add('transform', 'hover:scale-105', 'transition-transform');
        grid.appendChild(cardElement);
    });
    
    container.appendChild(grid);
    
    // Add continue button
    const continueBtn = document.createElement('button');
    continueBtn.className = 'mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full';
    continueBtn.textContent = 'Continue';
    continueBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    container.appendChild(continueBtn);
    
    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

/**
 * Generate pack cards with improved rarity distribution
 * @param {Object} set - The card set to generate cards from
 * @returns {Array} - The generated cards
 */
function generatePackCards(set) {
    const packCards = [];
    
    // Define pack structure: 7 commons, 3 uncommons, 1 rare slot
    const packStructure = [
        { rarity: 'Common', count: 7 },
        { rarity: 'Uncommon', count: 3 },
        { rarity: 'Rare Slot', count: 1 } // Special slot that can contain Holo Rare, Alternate Art, or Chase
    ];
    
    // Process each slot in the pack structure
    packStructure.forEach(slot => {
        for (let i = 0; i < slot.count; i++) {
            let selectedRarity = slot.rarity;
            
            // Handle the rare slot with weighted randomness
            if (selectedRarity === 'Rare Slot') {
                const rareSlotWeights = {
                    'Holo Rare': 80,
                    'Alternate Art': 15,
                    'Chase': 5
                };
                selectedRarity = weightedRandomChoice(rareSlotWeights);
            }
            
            // Filter available cards by rarity
            const availableCards = set.cards.filter(c => c.rarity === selectedRarity);
            
            if (availableCards.length > 0) {
                const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
                packCards.push(randomCard);
            } else {
                // Fallback to common if no cards of the selected rarity exist
                const commonCards = set.cards.filter(c => c.rarity === 'Common');
                if (commonCards.length > 0) {
                    const randomCard = commonCards[Math.floor(Math.random() * commonCards.length)];
                    packCards.push(randomCard);
                }
            }
        }
    });
    
    return packCards;
}