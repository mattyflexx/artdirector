// Enhanced Features Integration for Cardboard Capitalist
// This module integrates all the new features into the main game

/**
 * Initialize all enhanced features
 */
function initializeEnhancedFeatures() {
    console.log("Initializing enhanced features...");
    
    // Initialize trading system
    if (window.tradingSystem && window.tradingSystem.initializeTradingSystem) {
        window.tradingSystem.initializeTradingSystem();
        console.log("Trading system initialized");
    } else {
        console.warn("Trading system not available");
    }
    
    // Initialize grading system
    if (window.gradingSystem && window.gradingSystem.initializeGradingSystem) {
        window.gradingSystem.initializeGradingSystem();
        console.log("Grading system initialized");
    } else {
        console.warn("Grading system not available");
    }
    
    // Initialize Mythic Legends set
    if (window.mythicLegendsSet && window.mythicLegendsSet.initializeMythicLegendsSet) {
        window.mythicLegendsSet.createMythicLegendsPlaceholderImages();
        window.mythicLegendsSet.initializeMythicLegendsSet();
        console.log("Mythic Legends set initialized");
    } else {
        console.warn("Mythic Legends set not available");
    }
    
    // Add new navigation items
    addEnhancedNavigationItems();
    
    // Extend card value calculation to include grading
    extendCardValueCalculation();
    
    // Extend day advancement to check for completed gradings and set rotation
    extendDayAdvancement();
    
    // Add achievements for new features
    addEnhancedAchievements();
    
    console.log("Enhanced features initialization complete");
}

/**
 * Add new navigation items for enhanced features
 */
function addEnhancedNavigationItems() {
    // Get existing navigation items
    const existingNavItems = gameState.ui.navItems || [];
    
    // Add new navigation items if they don't exist
    const newNavItems = [
        {
            id: 'trading',
            label: 'Trading',
            icon: '🔄',
            view: 'trading',
            order: 4
        },
        {
            id: 'grading',
            label: 'Grading',
            icon: '🏅',
            view: 'grading',
            order: 5
        }
    ];
    
    // Check if items already exist
    const existingIds = existingNavItems.map(item => item.id);
    const itemsToAdd = newNavItems.filter(item => !existingIds.includes(item.id));
    
    // Add new items
    if (itemsToAdd.length > 0) {
        gameState.ui.navItems = [...existingNavItems, ...itemsToAdd];
        
        // Sort by order
        gameState.ui.navItems.sort((a, b) => a.order - b.order);
        
        console.log("Added new navigation items:", itemsToAdd.map(item => item.label).join(", "));
    }
}

/**
 * Extend card value calculation to include grading
 */
function extendCardValueCalculation() {
    // Store the original calculateCardValue function if it exists
    const originalCalculateCardValue = window.calculateCardValue;
    
    // Create a new function that includes grading
    window.calculateCardValue = function(card, instance) {
        // Get base value from original function
        let value = originalCalculateCardValue ? originalCalculateCardValue(card, instance) : 0;
        
        // If no original function, calculate a basic value
        if (!originalCalculateCardValue) {
            // Base value from card rarity
            switch (card.rarity) {
                case "Common":
                    value = 0.5 + Math.random() * 0.5; // $0.50-$1.00
                    break;
                case "Uncommon":
                    value = 1.0 + Math.random() * 1.0; // $1.00-$2.00
                    break;
                case "Rare":
                    value = 2.0 + Math.random() * 3.0; // $2.00-$5.00
                    break;
                case "Ultra Rare":
                    value = 5.0 + Math.random() * 10.0; // $5.00-$15.00
                    break;
                case "Secret Rare":
                    value = 15.0 + Math.random() * 35.0; // $15.00-$50.00
                    break;
                case "Mythic Rare":
                    value = 50.0 + Math.random() * 50.0; // $50.00-$100.00
                    break;
                default:
                    value = 1.0; // Default value
            }
            
            // Adjust for condition
            switch (instance.condition) {
                case "Mint":
                    // No adjustment, full value
                    break;
                case "Near Mint":
                    value *= 0.9; // 90% of value
                    break;
                case "Excellent":
                    value *= 0.8; // 80% of value
                    break;
                case "Good":
                    value *= 0.6; // 60% of value
                    break;
                case "Fair":
                    value *= 0.4; // 40% of value
                    break;
                case "Poor":
                    value *= 0.2; // 20% of value
                    break;
            }
            
            // Adjust for protection
            if (instance.protected) {
                if (instance.protected.sleeved) value *= 1.1; // +10% for sleeves
                if (instance.protected.toploader) value *= 1.15; // +15% for toploader
            }
        }
        
        // Apply grading value modifier if card is graded
        if (instance.graded && window.gradingSystem && window.gradingSystem.GRADING_SCALE) {
            const gradeInfo = window.gradingSystem.GRADING_SCALE[instance.graded];
            if (gradeInfo) {
                value *= gradeInfo.valueMultiplier;
            }
        }
        
        // Apply special mechanic modifiers
        if (card.specialMechanic) {
            switch (card.specialMechanic) {
                case "Legendary":
                    value *= 1.5; // 50% more valuable
                    break;
                case "Ancient Power":
                    value *= 1.3; // 30% more valuable
                    break;
                case "Mythic Evolution":
                    value *= 1.4; // 40% more valuable
                    break;
            }
        }
        
        // Apply market modifiers
        if (gameState.market && gameState.market.priceModifiers) {
            // Apply rarity modifier
            if (gameState.market.priceModifiers[card.rarity]) {
                value *= gameState.market.priceModifiers[card.rarity].modifier;
            }
            
            // Apply set modifier
            if (gameState.market.priceModifiers[card.set]) {
                value *= gameState.market.priceModifiers[card.set].modifier;
            }
            
            // Apply card-specific modifier
            if (gameState.market.priceModifiers[card.id]) {
                value *= gameState.market.priceModifiers[card.id].modifier;
            }
            
            // Apply mechanic modifier
            if (card.specialMechanic && gameState.market.priceModifiers[card.specialMechanic]) {
                value *= gameState.market.priceModifiers[card.specialMechanic].modifier;
            }
        }
        
        return value;
    };
    
    console.log("Extended card value calculation to include grading and special mechanics");
}

/**
 * Extend day advancement to check for completed gradings and set rotation
 */
function extendDayAdvancement() {
    // Store the original advanceDay function if it exists
    const originalAdvanceDay = window.advanceDay;
    
    // Create a new function that includes enhanced features
    window.advanceDay = function() {
        // Call original function if it exists
        if (originalAdvanceDay) {
            originalAdvanceDay();
        } else {
            // Basic day advancement if original function doesn't exist
            gameState.date.day++;
            
            // Check for year change
            if (gameState.date.day > 365) {
                gameState.date.day = 1;
                gameState.date.year++;
            }
            
            // Update market events
            updateMarketEvents();
        }
        
        // Check for completed gradings
        if (window.gradingSystem && window.gradingSystem.checkCompletedGradings) {
            window.gradingSystem.checkCompletedGradings();
        }
        
        // Update set rotation values
        if (window.mythicLegendsSet && window.mythicLegendsSet.updateSetRotationValues) {
            window.mythicLegendsSet.updateSetRotationValues();
        }
        
        // Check for new achievements
        checkEnhancedAchievements();
        
        // Update UI
        updateUI();
    };
    
    console.log("Extended day advancement to include grading and set rotation checks");
}

/**
 * Add achievements for new features
 */
function addEnhancedAchievements() {
    // Get existing achievements
    const existingAchievements = gameState.achievements || [];
    
    // Add new achievements
    const newAchievements = [
        {
            id: 'first_trade',
            name: 'First Deal',
            description: 'Complete your first trade with another collector',
            unlocked: false,
            icon: '🤝'
        },
        {
            id: 'trade_master',
            name: 'Trade Master',
            description: 'Complete 10 trades with other collectors',
            unlocked: false,
            icon: '📊'
        },
        {
            id: 'first_graded',
            name: 'Professional Grade',
            description: 'Get your first card professionally graded',
            unlocked: false,
            icon: '🏅'
        },
        {
            id: 'perfect_ten',
            name: 'Perfect Ten',
            description: 'Obtain a card with a perfect grade 10 rating',
            unlocked: false,
            icon: '💯'
        },
        {
            id: 'grading_collector',
            name: 'Grading Collector',
            description: 'Have 10 graded cards in your collection',
            unlocked: false,
            icon: '🏆'
        },
        {
            id: 'mythic_collector',
            name: 'Mythic Collector',
            description: 'Collect your first Mythic Rare card',
            unlocked: false,
            icon: '✨'
        },
        {
            id: 'legendary_set',
            name: 'Legendary Collector',
            description: 'Collect all cards with the Legendary mechanic',
            unlocked: false,
            icon: '👑'
        },
        {
            id: 'mythic_complete',
            name: 'Mythic Mastery',
            description: 'Complete the entire Mythic Legends set',
            unlocked: false,
            icon: '🏰'
        }
    ];
    
    // Check if achievements already exist
    const existingIds = existingAchievements.map(achievement => achievement.id);
    const achievementsToAdd = newAchievements.filter(achievement => !existingIds.includes(achievement.id));
    
    // Add new achievements
    if (achievementsToAdd.length > 0) {
        gameState.achievements = [...existingAchievements, ...achievementsToAdd];
        console.log("Added new achievements:", achievementsToAdd.map(achievement => achievement.name).join(", "));
    }
}

/**
 * Check for enhanced achievements
 */
function checkEnhancedAchievements() {
    // Skip if no achievements
    if (!gameState.achievements) return;
    
    // Check for trading achievements
    if (gameState.trading && gameState.trading.tradeHistory) {
        // First trade achievement
        const firstTradeAchievement = gameState.achievements.find(a => a.id === 'first_trade');
        if (firstTradeAchievement && !firstTradeAchievement.unlocked && gameState.trading.tradeHistory.length >= 1) {
            unlockAchievement('first_trade');
        }
        
        // Trade master achievement
        const tradeMasterAchievement = gameState.achievements.find(a => a.id === 'trade_master');
        if (tradeMasterAchievement && !tradeMasterAchievement.unlocked && gameState.trading.tradeHistory.length >= 10) {
            unlockAchievement('trade_master');
        }
    }
    
    // Check for grading achievements
    if (gameState.grading && gameState.grading.completedGradings) {
        // Count total graded cards
        let totalGradedCards = 0;
        let hasPerfectTen = false;
        
        gameState.grading.completedGradings.forEach(grading => {
            totalGradedCards += grading.cards.length;
            
            // Check for perfect 10
            grading.cards.forEach(card => {
                if (card.instance.graded === 10) {
                    hasPerfectTen = true;
                }
            });
        });
        
        // First graded card achievement
        const firstGradedAchievement = gameState.achievements.find(a => a.id === 'first_graded');
        if (firstGradedAchievement && !firstGradedAchievement.unlocked && totalGradedCards >= 1) {
            unlockAchievement('first_graded');
        }
        
        // Perfect ten achievement
        const perfectTenAchievement = gameState.achievements.find(a => a.id === 'perfect_ten');
        if (perfectTenAchievement && !perfectTenAchievement.unlocked && hasPerfectTen) {
            unlockAchievement('perfect_ten');
        }
        
        // Grading collector achievement
        const gradingCollectorAchievement = gameState.achievements.find(a => a.id === 'grading_collector');
        if (gradingCollectorAchievement && !gradingCollectorAchievement.unlocked && totalGradedCards >= 10) {
            unlockAchievement('grading_collector');
        }
    }
    
    // Check for Mythic Legends achievements
    if (gameState.player && gameState.player.collection) {
        // Count Mythic Rare cards
        let hasMythicRare = false;
        let legendaryCards = [];
        let mythicLegendsCards = [];
        
        Object.entries(gameState.player.collection).forEach(([cardId, instances]) => {
            if (instances.length > 0) {
                const card = TCG_CARDS[cardId];
                if (card) {
                    // Check for Mythic Rare
                    if (card.rarity === "Mythic Rare") {
                        hasMythicRare = true;
                    }
                    
                    // Check for Legendary mechanic
                    if (card.specialMechanic === "Legendary") {
                        legendaryCards.push(cardId);
                    }
                    
                    // Check for Mythic Legends set
                    if (card.set === "mythic_legends") {
                        mythicLegendsCards.push(cardId);
                    }
                }
            }
        });
        
        // Mythic collector achievement
        const mythicCollectorAchievement = gameState.achievements.find(a => a.id === 'mythic_collector');
        if (mythicCollectorAchievement && !mythicCollectorAchievement.unlocked && hasMythicRare) {
            unlockAchievement('mythic_collector');
        }
        
        // Legendary set achievement
        const legendarySetAchievement = gameState.achievements.find(a => a.id === 'legendary_set');
        if (legendarySetAchievement && !legendarySetAchievement.unlocked) {
            // Count total legendary cards in the game
            let totalLegendaryCards = 0;
            Object.values(TCG_CARDS).forEach(card => {
                if (card.specialMechanic === "Legendary") {
                    totalLegendaryCards++;
                }
            });
            
            if (legendaryCards.length >= totalLegendaryCards && totalLegendaryCards > 0) {
                unlockAchievement('legendary_set');
            }
        }
        
        // Mythic complete achievement
        const mythicCompleteAchievement = gameState.achievements.find(a => a.id === 'mythic_complete');
        if (mythicCompleteAchievement && !mythicCompleteAchievement.unlocked) {
            // Count total Mythic Legends cards in the game
            const totalMythicLegendsCards = Object.values(TCG_CARDS).filter(card => card.set === "mythic_legends").length;
            
            if (mythicLegendsCards.length >= totalMythicLegendsCards && totalMythicLegendsCards > 0) {
                unlockAchievement('mythic_complete');
            }
        }
    }
}

/**
 * Unlock an achievement
 * @param {string} achievementId - The ID of the achievement to unlock
 */
function unlockAchievement(achievementId) {
    const achievement = gameState.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedDate = { ...gameState.date };
        
        // Update stats
        gameState.stats.achievementsUnlocked++;
        
        // Show notification
        showAchievementNotification(achievement);
        
        console.log(`Achievement unlocked: ${achievement.name}`);
    }
}

/**
 * Show achievement notification
 * @param {Object} achievement - The achievement object
 */
function showAchievementNotification(achievement) {
    // Use the game's existing notification system if available
    if (typeof logMessage === 'function') {
        logMessage(`Achievement Unlocked: ${achievement.name} - ${achievement.description}`, "achievement");
    } else {
        console.log(`Achievement Unlocked: ${achievement.name} - ${achievement.description}`);
    }
    
    // Create a visual notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
            <div class="achievement-title">Achievement Unlocked!</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after a delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

/**
 * Update market events
 * Basic implementation if the original function doesn't exist
 */
function updateMarketEvents() {
    if (!gameState.market) {
        gameState.market = {
            events: [],
            activeEvents: [],
            priceModifiers: {}
        };
    }
    
    // Update active events
    gameState.market.activeEvents = gameState.market.activeEvents.filter(event => {
        event.remainingDays--;
        return event.remainingDays > 0;
    });
    
    // Update price modifiers
    Object.keys(gameState.market.priceModifiers).forEach(key => {
        gameState.market.priceModifiers[key].remainingDays--;
        if (gameState.market.priceModifiers[key].remainingDays <= 0) {
            delete gameState.market.priceModifiers[key];
        }
    });
    
    // Random chance for new event
    if (Math.random() < 0.1 && gameState.market.possibleEvents && gameState.market.possibleEvents.length > 0) {
        // Filter events that can trigger
        const eligibleEvents = gameState.market.possibleEvents.filter(event => {
            // Check if one-time event already triggered
            if (event.oneTime && gameState.market.events.some(e => e.id === event.id)) {
                return false;
            }
            
            // Check trigger condition
            if (event.triggerCondition) {
                if (event.triggerCondition.type === "year") {
                    if (gameState.date.year < event.triggerCondition.year) {
                        return false;
                    }
                    
                    if (event.triggerCondition.day && gameState.date.day !== event.triggerCondition.day) {
                        return false;
                    }
                    
                    if (event.triggerCondition.minDay && gameState.date.day < event.triggerCondition.minDay) {
                        return false;
                    }
                }
            }
            
            return true;
        });
        
        if (eligibleEvents.length > 0) {
            // Weight-based selection
            const totalWeight = eligibleEvents.reduce((sum, event) => sum + (event.weight || 1), 0);
            let random = Math.random() * totalWeight;
            
            let selectedEvent = null;
            for (const event of eligibleEvents) {
                random -= (event.weight || 1);
                if (random <= 0) {
                    selectedEvent = event;
                    break;
                }
            }
            
            if (selectedEvent) {
                triggerMarketEvent(selectedEvent);
            }
        }
    }
}

/**
 * Trigger a market event
 * @param {Object} event - The event object
 */
function triggerMarketEvent(event) {
    // Add to events history
    gameState.market.events.push({
        ...event,
        date: { ...gameState.date }
    });
    
    // Add to active events
    gameState.market.activeEvents.push({
        id: event.id,
        name: event.name,
        remainingDays: event.effect.duration
    });
    
    // Apply effect
    if (event.effect.type === "rarity_value_modifier") {
        gameState.market.priceModifiers[event.effect.rarity] = {
            modifier: event.effect.modifier,
            remainingDays: event.effect.duration
        };
    } else if (event.effect.type === "set_value_modifier") {
        gameState.market.priceModifiers[event.effect.set] = {
            modifier: event.effect.modifier,
            remainingDays: event.effect.duration
        };
    } else if (event.effect.type === "card_value_modifier") {
        gameState.market.priceModifiers[event.effect.cardId] = {
            modifier: event.effect.modifier,
            remainingDays: event.effect.duration
        };
    } else if (event.effect.type === "mechanic_value_modifier") {
        gameState.market.priceModifiers[event.effect.mechanic] = {
            modifier: event.effect.modifier,
            remainingDays: event.effect.duration
        };
    }
    
    // Show notification
    if (typeof logMessage === 'function') {
        logMessage(`Market Event: ${event.name} - ${event.description}`, "market");
    } else {
        console.log(`Market Event: ${event.name} - ${event.description}`);
    }
    
    // Update stats
    gameState.stats.marketEvents++;
}

/**
 * Update the UI
 * Basic implementation if the original function doesn't exist
 */
function updateUI() {
    // Update player stats
    const playerCash = document.getElementById('player-cash');
    if (playerCash) {
        playerCash.textContent = `$${gameState.player.cash.toFixed(2)}`;
    }
    
    const playerNetWorth = document.getElementById('player-net-worth');
    if (playerNetWorth) {
        // Calculate net worth
        let netWorth = gameState.player.cash;
        
        // Add value of collection
        Object.entries(gameState.player.collection).forEach(([cardId, instances]) => {
            instances.forEach(instance => {
                const card = TCG_CARDS[cardId];
                if (card) {
                    netWorth += calculateCardValue(card, instance);
                }
            });
        });
        
        // Add value of sealed inventory
        Object.entries(gameState.player.sealedInventory).forEach(([setId, count]) => {
            const set = TCG_SETS[setId];
            if (set) {
                netWorth += set.packPrice * count;
            }
        });
        
        gameState.player.netWorth = netWorth;
        playerNetWorth.textContent = `$${netWorth.toFixed(2)}`;
    }
    
    const playerSleeves = document.getElementById('player-sleeves');
    if (playerSleeves) {
        playerSleeves.textContent = gameState.player.supplies.sleeves;
    }
    
    const playerToploaders = document.getElementById('player-toploaders');
    if (playerToploaders) {
        playerToploaders.textContent = gameState.player.supplies.toploaders;
    }
    
    // Update game date
    const gameDate = document.getElementById('game-date');
    if (gameDate) {
        gameDate.textContent = `Year ${gameState.date.year}, Day ${gameState.date.day}`;
    }
    
    // Update current view if needed
    if (gameState.ui.currentView) {
        renderMainView(gameState.ui.currentView);
    }
}

/**
 * Render the main view based on the current view
 * @param {string} view - The view to render
 */
function renderMainView(view) {
    // Store current view
    gameState.ui.currentView = view;
    
    // Get main view element
    const mainView = document.getElementById('main-view');
    if (!mainView) return;
    
    // Update view title
    const viewTitle = document.getElementById('view-title');
    if (viewTitle) {
        viewTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
    }
    
    // Render view based on type
    switch (view) {
        case 'trading':
            if (window.tradingSystem && window.tradingSystem.renderTradingView) {
                window.tradingSystem.renderTradingView();
            } else {
                mainView.innerHTML = '<div class="error-message">Trading system not available</div>';
            }
            break;
        case 'grading':
            if (window.gradingSystem && window.gradingSystem.renderGradingView) {
                window.gradingSystem.renderGradingView();
            } else {
                mainView.innerHTML = '<div class="error-message">Grading system not available</div>';
            }
            break;
        default:
            // Use original renderMainView if available
            if (typeof originalRenderMainView === 'function') {
                originalRenderMainView(view);
            } else {
                mainView.innerHTML = `<div class="view-content">${view} view</div>`;
            }
    }
}

// Export functions for use in main game
window.enhancedFeatures = {
    initializeEnhancedFeatures,
    addEnhancedNavigationItems,
    extendCardValueCalculation,
    extendDayAdvancement,
    addEnhancedAchievements,
    checkEnhancedAchievements,
    unlockAchievement
};