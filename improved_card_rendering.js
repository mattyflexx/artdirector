// Improved card rendering functionality

/**
 * Builds a card element with improved styling and interaction
 * @param {Object} cardInfo - The card information
 * @param {Object} instance - The specific card instance
 * @returns {HTMLElement} - The card element
 */
function buildCardElement(cardInfo, instance) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card-container';
    cardElement.dataset.cardId = cardInfo.id;
    if (instance) cardElement.dataset.instanceUid = instance.uid;
    
    // Add hover effect
    cardElement.addEventListener('mouseenter', () => {
        cardElement.classList.add('card-hover');
    });
    
    cardElement.addEventListener('mouseleave', () => {
        cardElement.classList.remove('card-hover');
    });
    
    // Card art
    const artImg = document.createElement('img');
    artImg.src = cardInfo.img || `${ASSET_PATH}fallback.png`;
    artImg.alt = cardInfo.name;
    artImg.className = 'card-art';
    artImg.loading = 'lazy'; // Enable lazy loading for better performance
    cardElement.appendChild(artImg);
    
    // Card frame
    const frameImg = document.createElement('img');
    const frameType = cardInfo.layout === 'Full-Art' ? 'fullArt' : 'standard';
    frameImg.src = ASSETS.frames[frameType];
    frameImg.className = 'card-frame';
    cardElement.appendChild(frameImg);
    
    // Text overlay
    const textOverlay = document.createElement('div');
    textOverlay.className = 'card-text-overlay';
    
    // Rarity indicator
    const rarityIndicator = document.createElement('div');
    rarityIndicator.className = 'card-rarity-indicator';
    rarityIndicator.style.position = 'absolute';
    rarityIndicator.style.top = '5%';
    rarityIndicator.style.right = '10%';
    rarityIndicator.style.width = '20px';
    rarityIndicator.style.height = '20px';
    rarityIndicator.style.borderRadius = '50%';
    
    // Set color based on rarity
    switch (cardInfo.rarity) {
        case 'Common':
            rarityIndicator.style.backgroundColor = '#b0b0b0';
            break;
        case 'Uncommon':
            rarityIndicator.style.backgroundColor = '#3a9e3a';
            break;
        case 'Holo Rare':
            rarityIndicator.style.backgroundColor = '#e6c619';
            rarityIndicator.style.boxShadow = '0 0 5px #e6c619';
            break;
        case 'Alternate Art':
            rarityIndicator.style.backgroundColor = '#9966cc';
            rarityIndicator.style.boxShadow = '0 0 5px #9966cc';
            break;
        case 'Chase':
            rarityIndicator.style.backgroundColor = '#e62929';
            rarityIndicator.style.boxShadow = '0 0 5px #e62929';
            break;
        default:
            rarityIndicator.style.backgroundColor = '#b0b0b0';
    }
    
    textOverlay.appendChild(rarityIndicator);
    
    // Card ID
    const cardIdText = document.createElement('div');
    cardIdText.className = 'card-id-text';
    cardIdText.style.position = 'absolute';
    cardIdText.style.top = '5%';
    cardIdText.style.left = '10%';
    cardIdText.style.fontSize = '0.7rem';
    cardIdText.style.color = 'rgba(255, 255, 255, 0.7)';
    cardIdText.textContent = cardInfo.id;
    textOverlay.appendChild(cardIdText);
    
    // Name box
    const nameBox = document.createElement('div');
    nameBox.className = 'card-name-box';
    nameBox.style.left = '10%';
    nameBox.style.top = '43%';
    nameBox.style.width = '80%';
    nameBox.textContent = cardInfo.name;
    textOverlay.appendChild(nameBox);
    
    // Lore box
    const loreBox = document.createElement('div');
    loreBox.className = 'card-lore-box';
    loreBox.style.left = '10%';
    loreBox.style.top = '55%';
    loreBox.style.width = '80%';
    loreBox.style.height = '20%';
    loreBox.textContent = cardInfo.lore || "A mysterious creature with unknown powers.";
    textOverlay.appendChild(loreBox);
    
    // Add evolution chain if applicable
    if (cardInfo.evolvesFrom) {
        const evolutionChain = buildEvolutionChain(cardInfo);
        if (evolutionChain) {
            evolutionChain.style.position = 'absolute';
            evolutionChain.style.top = '2%';
            evolutionChain.style.left = '50%';
            evolutionChain.style.transform = 'translateX(-50%)';
            textOverlay.appendChild(evolutionChain);
        }
    }
    
    // Add condition indicator if instance exists
    if (instance) {
        const conditionIndicator = document.createElement('div');
        conditionIndicator.className = 'card-condition-indicator';
        conditionIndicator.style.position = 'absolute';
        conditionIndicator.style.bottom = '5%';
        conditionIndicator.style.right = '10%';
        conditionIndicator.style.fontSize = '0.7rem';
        conditionIndicator.style.padding = '2px 5px';
        conditionIndicator.style.borderRadius = '3px';
        
        // Set color based on condition
        switch (instance.condition) {
            case 'Mint':
                conditionIndicator.style.backgroundColor = 'rgba(58, 158, 58, 0.7)';
                break;
            case 'Near Mint':
                conditionIndicator.style.backgroundColor = 'rgba(88, 188, 88, 0.7)';
                break;
            case 'Excellent':
                conditionIndicator.style.backgroundColor = 'rgba(230, 198, 25, 0.7)';
                break;
            case 'Good':
                conditionIndicator.style.backgroundColor = 'rgba(230, 149, 25, 0.7)';
                break;
            case 'Poor':
                conditionIndicator.style.backgroundColor = 'rgba(230, 41, 41, 0.7)';
                break;
            default:
                conditionIndicator.style.backgroundColor = 'rgba(176, 176, 176, 0.7)';
        }
        
        conditionIndicator.textContent = instance.condition;
        textOverlay.appendChild(conditionIndicator);
        
        // Add protection indicators
        if (instance.sleeved || instance.toploadered) {
            const protectionIndicator = document.createElement('div');
            protectionIndicator.className = 'card-protection-indicator';
            protectionIndicator.style.position = 'absolute';
            protectionIndicator.style.bottom = '5%';
            protectionIndicator.style.left = '10%';
            protectionIndicator.style.fontSize = '0.7rem';
            
            if (instance.sleeved && instance.toploadered) {
                protectionIndicator.textContent = '🛡️ Protected';
                protectionIndicator.style.color = 'gold';
            } else if (instance.sleeved) {
                protectionIndicator.textContent = '🛡️ Sleeved';
                protectionIndicator.style.color = 'silver';
            } else if (instance.toploadered) {
                protectionIndicator.textContent = '🛡️ Toploadered';
                protectionIndicator.style.color = 'silver';
            }
            
            textOverlay.appendChild(protectionIndicator);
        }
    }
    
    cardElement.appendChild(textOverlay);
    
    // Holo effect for rare cards
    if (cardInfo.rarity === 'Holo Rare' || cardInfo.rarity === 'Chase' || cardInfo.rarity === 'Alternate Art') {
        const holoOverlay = document.createElement('div');
        holoOverlay.className = 'card-holo-overlay';
        cardElement.appendChild(holoOverlay);
    }
    
    // Inspection overlay
    const inspectOverlay = document.createElement('div');
    inspectOverlay.className = 'card-inspect-overlay';
    inspectOverlay.addEventListener('click', () => {
        showCardDetail(cardInfo, instance);
    });
    cardElement.appendChild(inspectOverlay);
    
    return cardElement;
}

/**
 * Builds an evolution chain element for a card
 * @param {Object} cardInfo - The card information
 * @returns {HTMLElement|null} - The evolution chain element or null if not applicable
 */
function buildEvolutionChain(cardInfo) {
    if (!cardInfo.evolvesFrom) return null;
    
    // Find the evolution chain
    let currentCard = cardInfo;
    const evolutionChain = [currentCard];
    
    // Find previous evolutions
    while (currentCard.evolvesFrom) {
        const previousCardId = currentCard.evolvesFrom;
        const previousCard = findCardById(previousCardId);
        
        if (previousCard) {
            evolutionChain.unshift(previousCard);
            currentCard = previousCard;
        } else {
            break;
        }
    }
    
    // Find next evolutions
    currentCard = cardInfo;
    const nextEvolutions = findEvolutionsOf(currentCard.id);
    evolutionChain.push(...nextEvolutions);
    
    // Create the evolution chain container
    const container = document.createElement('div');
    container.className = 'evolution-chain-container';
    
    const chainElement = document.createElement('div');
    chainElement.className = 'evolution-chain';
    chainElement.style.backgroundImage = `url(${ASSETS.evolutionChainBg})`;
    
    // Add each evolution node
    evolutionChain.forEach((card, index) => {
        // Add arrow between nodes
        if (index > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'evolution-arrow';
            chainElement.appendChild(arrow);
        }
        
        // Add node
        const node = document.createElement('div');
        node.className = 'evolution-node';
        node.style.backgroundImage = `url(${card.img})`;
        
        // Highlight current card
        if (card.id === cardInfo.id) {
            node.classList.add('current');
        }
        
        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'evolution-tooltip';
        tooltip.textContent = card.name;
        node.appendChild(tooltip);
        
        chainElement.appendChild(node);
    });
    
    container.appendChild(chainElement);
    return container;
}

/**
 * Find a card by its ID
 * @param {string} cardId - The card ID to find
 * @returns {Object|null} - The card object or null if not found
 */
function findCardById(cardId) {
    for (const setKey in TCG_SETS) {
        const set = TCG_SETS[setKey];
        const card = set.cards.find(c => c.id === cardId);
        if (card) return card;
    }
    return null;
}

/**
 * Find cards that evolve from the given card ID
 * @param {string} cardId - The card ID to find evolutions for
 * @returns {Array} - Array of cards that evolve from the given card
 */
function findEvolutionsOf(cardId) {
    const evolutions = [];
    
    for (const setKey in TCG_SETS) {
        const set = TCG_SETS[setKey];
        const cards = set.cards.filter(c => c.evolvesFrom === cardId);
        evolutions.push(...cards);
    }
    
    return evolutions;
}

/**
 * Shows detailed card information in a modal
 * @param {Object} cardInfo - The card information
 * @param {Object} instance - The specific card instance
 */
function showCardDetail(cardInfo, instance) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    
    // Create modal container
    const container = document.createElement('div');
    container.className = 'bg-gray-900 p-6 rounded-lg max-w-4xl w-full flex flex-col md:flex-row gap-6';
    
    // Left side - Card image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'w-full md:w-1/2 flex items-center justify-center';
    
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container w-64 h-auto';
    
    // Create a larger version of the card
    const largeCard = buildCardElement(cardInfo, instance);
    largeCard.style.transform = 'scale(1.5)';
    largeCard.style.transformOrigin = 'center';
    largeCard.style.margin = '2rem';
    
    cardContainer.appendChild(largeCard);
    imageContainer.appendChild(cardContainer);
    container.appendChild(imageContainer);
    
    // Right side - Card details
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'w-full md:w-1/2 text-white';
    
    // Card name and ID
    const nameHeader = document.createElement('h2');
    nameHeader.className = 'text-2xl font-bold mb-2';
    nameHeader.textContent = cardInfo.name;
    detailsContainer.appendChild(nameHeader);
    
    const idText = document.createElement('p');
    idText.className = 'text-sm text-gray-400 mb-4';
    idText.textContent = `ID: ${cardInfo.id} • Doodledex #${cardInfo.doodledexNum}`;
    detailsContainer.appendChild(idText);
    
    // Card rarity
    const rarityDiv = document.createElement('div');
    rarityDiv.className = 'mb-4';
    
    const rarityLabel = document.createElement('h3');
    rarityLabel.className = 'text-sm text-gray-400';
    rarityLabel.textContent = 'Rarity';
    rarityDiv.appendChild(rarityLabel);
    
    const rarityValue = document.createElement('p');
    rarityValue.className = 'text-lg font-semibold';
    
    // Style based on rarity
    switch (cardInfo.rarity) {
        case 'Common':
            rarityValue.className += ' text-gray-300';
            break;
        case 'Uncommon':
            rarityValue.className += ' text-green-400';
            break;
        case 'Holo Rare':
            rarityValue.className += ' text-yellow-400';
            break;
        case 'Alternate Art':
            rarityValue.className += ' text-purple-400';
            break;
        case 'Chase':
            rarityValue.className += ' text-red-400';
            break;
    }
    
    rarityValue.textContent = cardInfo.rarity;
    rarityDiv.appendChild(rarityValue);
    detailsContainer.appendChild(rarityDiv);
    
    // Card lore
    const loreDiv = document.createElement('div');
    loreDiv.className = 'mb-4';
    
    const loreLabel = document.createElement('h3');
    loreLabel.className = 'text-sm text-gray-400';
    loreLabel.textContent = 'Lore';
    loreDiv.appendChild(loreLabel);
    
    const loreValue = document.createElement('p');
    loreValue.className = 'text-base italic';
    loreValue.textContent = cardInfo.lore || "A mysterious creature with unknown powers.";
    loreDiv.appendChild(loreValue);
    detailsContainer.appendChild(loreDiv);
    
    // Card instance details (if available)
    if (instance) {
        const instanceDiv = document.createElement('div');
        instanceDiv.className = 'mb-4';
        
        const instanceLabel = document.createElement('h3');
        instanceLabel.className = 'text-sm text-gray-400';
        instanceLabel.textContent = 'Card Details';
        instanceDiv.appendChild(instanceLabel);
        
        // Condition
        const conditionDiv = document.createElement('div');
        conditionDiv.className = 'flex justify-between items-center mb-2';
        
        const conditionText = document.createElement('span');
        conditionText.textContent = 'Condition:';
        conditionDiv.appendChild(conditionText);
        
        const conditionValue = document.createElement('span');
        conditionValue.className = 'font-semibold';
        
        // Style based on condition
        switch (instance.condition) {
            case 'Mint':
                conditionValue.className += ' text-green-400';
                break;
            case 'Near Mint':
                conditionValue.className += ' text-green-300';
                break;
            case 'Excellent':
                conditionValue.className += ' text-yellow-400';
                break;
            case 'Good':
                conditionValue.className += ' text-yellow-600';
                break;
            case 'Poor':
                conditionValue.className += ' text-red-400';
                break;
        }
        
        conditionValue.textContent = instance.condition;
        conditionDiv.appendChild(conditionValue);
        instanceDiv.appendChild(conditionDiv);
        
        // Protection
        const protectionDiv = document.createElement('div');
        protectionDiv.className = 'flex justify-between items-center mb-2';
        
        const protectionText = document.createElement('span');
        protectionText.textContent = 'Protection:';
        protectionDiv.appendChild(protectionText);
        
        const protectionValue = document.createElement('span');
        
        if (instance.sleeved && instance.toploadered) {
            protectionValue.textContent = 'Sleeved & Toploadered';
            protectionValue.className = 'text-yellow-400 font-semibold';
        } else if (instance.sleeved) {
            protectionValue.textContent = 'Sleeved';
            protectionValue.className = 'text-blue-400 font-semibold';
        } else if (instance.toploadered) {
            protectionValue.textContent = 'Toploadered';
            protectionValue.className = 'text-blue-400 font-semibold';
        } else {
            protectionValue.textContent = 'None';
            protectionValue.className = 'text-gray-400';
        }
        
        protectionDiv.appendChild(protectionValue);
        instanceDiv.appendChild(protectionDiv);
        
        // Acquisition date
        const acquiredDiv = document.createElement('div');
        acquiredDiv.className = 'flex justify-between items-center';
        
        const acquiredText = document.createElement('span');
        acquiredText.textContent = 'Acquired:';
        acquiredDiv.appendChild(acquiredText);
        
        const acquiredValue = document.createElement('span');
        acquiredValue.textContent = `Year ${instance.acquired.year}, Day ${instance.acquired.day}`;
        acquiredDiv.appendChild(acquiredValue);
        instanceDiv.appendChild(acquiredDiv);
        
        detailsContainer.appendChild(instanceDiv);
        
        // Card value
        const valueDiv = document.createElement('div');
        valueDiv.className = 'mb-4';
        
        const valueLabel = document.createElement('h3');
        valueLabel.className = 'text-sm text-gray-400';
        valueLabel.textContent = 'Estimated Value';
        valueDiv.appendChild(valueLabel);
        
        const valueAmount = document.createElement('p');
        valueAmount.className = 'text-xl font-bold text-green-400';
        
        // Calculate value based on rarity and condition
        const baseValue = getCardBaseValue(cardInfo);
        const conditionMultiplier = getConditionMultiplier(instance.condition);
        const protectionBonus = (instance.sleeved ? 0.1 : 0) + (instance.toploadered ? 0.15 : 0);
        
        const totalValue = baseValue * (conditionMultiplier + protectionBonus);
        valueAmount.textContent = `$${totalValue.toFixed(2)}`;
        
        valueDiv.appendChild(valueAmount);
        detailsContainer.appendChild(valueDiv);
        
        // Actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'mt-6 space-y-2';
        
        // Sleeve/unsleeve button
        if (!instance.sleeved && gameState.player.supplies.sleeves > 0) {
            const sleeveBtn = document.createElement('button');
            sleeveBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full';
            sleeveBtn.textContent = 'Add Sleeve';
            sleeveBtn.addEventListener('click', () => {
                sleeveCard(instance.uid);
                document.body.removeChild(overlay);
            });
            actionsDiv.appendChild(sleeveBtn);
        } else if (instance.sleeved) {
            const unsleeveBtn = document.createElement('button');
            unsleeveBtn.className = 'bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full';
            unsleeveBtn.textContent = 'Remove Sleeve';
            unsleeveBtn.addEventListener('click', () => {
                unsleeveCard(instance.uid);
                document.body.removeChild(overlay);
            });
            actionsDiv.appendChild(unsleeveBtn);
        }
        
        // Toploader/remove toploader button
        if (!instance.toploadered && gameState.player.supplies.toploaders > 0) {
            const toploaderBtn = document.createElement('button');
            toploaderBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full';
            toploaderBtn.textContent = 'Add Toploader';
            toploaderBtn.addEventListener('click', () => {
                addToploader(instance.uid);
                document.body.removeChild(overlay);
            });
            actionsDiv.appendChild(toploaderBtn);
        } else if (instance.toploadered) {
            const removeToploaderBtn = document.createElement('button');
            removeToploaderBtn.className = 'bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full';
            removeToploaderBtn.textContent = 'Remove Toploader';
            removeToploaderBtn.addEventListener('click', () => {
                removeToploader(instance.uid);
                document.body.removeChild(overlay);
            });
            actionsDiv.appendChild(removeToploaderBtn);
        }
        
        detailsContainer.appendChild(actionsDiv);
    }
    
    container.appendChild(detailsContainer);
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    container.appendChild(closeBtn);
    
    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

/**
 * Get the base value of a card based on its rarity
 * @param {Object} cardInfo - The card information
 * @returns {number} - The base value
 */
function getCardBaseValue(cardInfo) {
    const rarityValues = {
        'Common': 0.25,
        'Uncommon': 0.75,
        'Holo Rare': 3.00,
        'Alternate Art': 15.00,
        'Chase': 50.00
    };
    return rarityValues[cardInfo.rarity] || 0.10;
}

/**
 * Get the condition multiplier for a card
 * @param {string} condition - The card condition
 * @returns {number} - The condition multiplier
 */
function getConditionMultiplier(condition) {
    const conditionValues = {
        'Mint': 1.0,
        'Near Mint': 0.9,
        'Excellent': 0.7,
        'Good': 0.5,
        'Poor': 0.3
    };
    return conditionValues[condition] || 0.5;
}

/**
 * Add a sleeve to a card
 * @param {string} cardUid - The unique ID of the card instance
 */
function sleeveCard(cardUid) {
    // Find the card instance
    const cardInstance = findCardInstanceByUid(cardUid);
    
    if (!cardInstance || cardInstance.sleeved || gameState.player.supplies.sleeves <= 0) {
        return;
    }
    
    // Apply sleeve
    cardInstance.sleeved = true;
    gameState.player.supplies.sleeves--;
    
    // Log message
    logMessage(`Added a sleeve to ${cardInstance.cardInfo.name}.`, "system");
    
    // Update UI
    updateUI();
    renderMainView('collection');
}

/**
 * Remove a sleeve from a card
 * @param {string} cardUid - The unique ID of the card instance
 */
function unsleeveCard(cardUid) {
    // Find the card instance
    const cardInstance = findCardInstanceByUid(cardUid);
    
    if (!cardInstance || !cardInstance.sleeved) {
        return;
    }
    
    // Remove sleeve
    cardInstance.sleeved = false;
    gameState.player.supplies.sleeves++;
    
    // Log message
    logMessage(`Removed sleeve from ${cardInstance.cardInfo.name}.`, "system");
    
    // Update UI
    updateUI();
    renderMainView('collection');
}

/**
 * Add a toploader to a card
 * @param {string} cardUid - The unique ID of the card instance
 */
function addToploader(cardUid) {
    // Find the card instance
    const cardInstance = findCardInstanceByUid(cardUid);
    
    if (!cardInstance || cardInstance.toploadered || gameState.player.supplies.toploaders <= 0) {
        return;
    }
    
    // Apply toploader
    cardInstance.toploadered = true;
    gameState.player.supplies.toploaders--;
    
    // Log message
    logMessage(`Added a toploader to ${cardInstance.cardInfo.name}.`, "system");
    
    // Update UI
    updateUI();
    renderMainView('collection');
}

/**
 * Remove a toploader from a card
 * @param {string} cardUid - The unique ID of the card instance
 */
function removeToploader(cardUid) {
    // Find the card instance
    const cardInstance = findCardInstanceByUid(cardUid);
    
    if (!cardInstance || !cardInstance.toploadered) {
        return;
    }
    
    // Remove toploader
    cardInstance.toploadered = false;
    gameState.player.supplies.toploaders++;
    
    // Log message
    logMessage(`Removed toploader from ${cardInstance.cardInfo.name}.`, "system");
    
    // Update UI
    updateUI();
    renderMainView('collection');
}

/**
 * Find a card instance by its unique ID
 * @param {string} uid - The unique ID to find
 * @returns {Object|null} - The card instance or null if not found
 */
function findCardInstanceByUid(uid) {
    for (const cardId in gameState.player.collection) {
        const cardData = gameState.player.collection[cardId];
        
        for (const instance of cardData.instances) {
            if (instance.uid === uid) {
                return {
                    cardInfo: cardData.cardInfo,
                    ...instance
                };
            }
        }
    }
    
    return null;
}