// Trading System for Cardboard Capitalist
// This module implements AI traders, trading interface, and trading mechanics

/**
 * Trader personality types and their characteristics
 */
const TRADER_PERSONALITIES = {
    COLLECTOR: {
        name: "Collector",
        description: "Focuses on completing sets and acquiring rare cards",
        interests: {
            completeSet: 0.8,
            highRarity: 0.7,
            condition: 0.6,
            value: 0.3
        },
        negotiation: {
            initialOffer: 0.9, // Offers 90% of fair value
            counterThreshold: 0.85, // Will accept 85% of fair value
            maxRounds: 3 // Will negotiate up to 3 rounds
        },
        color: "#8e44ad" // Purple
    },
    INVESTOR: {
        name: "Investor",
        description: "Focuses on card value and potential growth",
        interests: {
            value: 0.9,
            highRarity: 0.8,
            condition: 0.7,
            completeSet: 0.4
        },
        negotiation: {
            initialOffer: 0.8, // Offers 80% of fair value
            counterThreshold: 0.9, // Will accept 90% of fair value
            maxRounds: 5 // Will negotiate up to 5 rounds
        },
        color: "#2ecc71" // Green
    },
    CASUAL: {
        name: "Casual",
        description: "Trades for fun and personal preference",
        interests: {
            personal: 0.9, // Has personal favorites
            value: 0.5,
            completeSet: 0.4,
            highRarity: 0.3
        },
        negotiation: {
            initialOffer: 1.0, // Offers fair value
            counterThreshold: 0.95, // Will accept 95% of fair value
            maxRounds: 2 // Will negotiate up to 2 rounds
        },
        color: "#3498db" // Blue
    },
    COMPETITIVE: {
        name: "Competitive",
        description: "Focuses on powerful and valuable cards",
        interests: {
            power: 0.9,
            highRarity: 0.8,
            value: 0.7,
            condition: 0.6
        },
        negotiation: {
            initialOffer: 0.85, // Offers 85% of fair value
            counterThreshold: 0.9, // Will accept 90% of fair value
            maxRounds: 4 // Will negotiate up to 4 rounds
        },
        color: "#e74c3c" // Red
    }
};

/**
 * AI Trader class
 */
class AITrader {
    constructor(name, personality, specialInterests = {}) {
        this.name = name;
        this.personality = personality;
        this.specialInterests = specialInterests; // Specific cards or sets this trader is interested in
        this.inventory = {};
        this.cash = 100 + Math.random() * 900; // Random starting cash between 100 and 1000
        this.reputation = 50; // 0-100 scale
        this.tradeHistory = [];
        this.avatar = `https://api.dicebear.com/7.x/personas/svg?seed=${name.replace(/\s/g, '')}`;
    }

    /**
     * Generate a random inventory for this trader
     * @param {Object} cardDatabase - The card database to pull from
     * @param {number} size - The number of cards to generate
     */
    generateInventory(cardDatabase, size = 20) {
        const cardIds = Object.keys(cardDatabase);
        
        // Generate random cards based on personality
        for (let i = 0; i < size; i++) {
            const randomCardId = cardIds[Math.floor(Math.random() * cardIds.length)];
            const card = cardDatabase[randomCardId];
            
            // Create a card instance
            const instance = {
                uid: `trader-${this.name.replace(/\s/g, '')}-${randomCardId}-${i}`,
                cardId: randomCardId,
                condition: this.generateCondition(),
                protected: this.generateProtection(),
                graded: Math.random() < 0.2 ? Math.floor(Math.random() * 5) + 6 : null, // 20% chance of being graded 6-10
                acquired: { year: 1, day: 1 }
            };
            
            // Add to inventory
            if (!this.inventory[randomCardId]) {
                this.inventory[randomCardId] = [];
            }
            this.inventory[randomCardId].push(instance);
        }
    }
    
    /**
     * Generate a condition for a card based on trader personality
     */
    generateCondition() {
        const conditions = ["Mint", "Near Mint", "Excellent", "Good", "Fair", "Poor"];
        const personalityType = this.personality;
        
        // Different personalities care about condition differently
        let weights;
        switch (personalityType) {
            case TRADER_PERSONALITIES.COLLECTOR:
                weights = [0.4, 0.3, 0.2, 0.1, 0, 0]; // Collectors prefer mint condition
                break;
            case TRADER_PERSONALITIES.INVESTOR:
                weights = [0.5, 0.3, 0.1, 0.1, 0, 0]; // Investors strongly prefer mint condition
                break;
            case TRADER_PERSONALITIES.CASUAL:
                weights = [0.2, 0.2, 0.2, 0.2, 0.1, 0.1]; // Casuals don't care as much
                break;
            case TRADER_PERSONALITIES.COMPETITIVE:
                weights = [0.3, 0.3, 0.2, 0.1, 0.1, 0]; // Competitive players prefer good condition
                break;
            default:
                weights = [0.2, 0.3, 0.2, 0.2, 0.1, 0]; // Default distribution
        }
        
        // Use weights to determine condition
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < weights.length; i++) {
            cumulativeWeight += weights[i];
            if (random < cumulativeWeight) {
                return conditions[i];
            }
        }
        
        return conditions[0]; // Default to Mint if something goes wrong
    }
    
    /**
     * Generate protection status for a card based on trader personality
     */
    generateProtection() {
        const personalityType = this.personality;
        
        // Different personalities protect cards differently
        let sleeveChance, toploaderChance;
        switch (personalityType) {
            case TRADER_PERSONALITIES.COLLECTOR:
                sleeveChance = 0.9;
                toploaderChance = 0.5;
                break;
            case TRADER_PERSONALITIES.INVESTOR:
                sleeveChance = 0.95;
                toploaderChance = 0.7;
                break;
            case TRADER_PERSONALITIES.CASUAL:
                sleeveChance = 0.5;
                toploaderChance = 0.1;
                break;
            case TRADER_PERSONALITIES.COMPETITIVE:
                sleeveChance = 0.8;
                toploaderChance = 0.3;
                break;
            default:
                sleeveChance = 0.7;
                toploaderChance = 0.3;
        }
        
        const hasSleeved = Math.random() < sleeveChance;
        const hasToploader = Math.random() < toploaderChance;
        
        return {
            sleeved: hasSleeved,
            toploader: hasToploader
        };
    }
    
    /**
     * Evaluate a card's value to this trader based on their personality
     * @param {Object} card - The card data
     * @param {Object} instance - The specific card instance
     * @param {number} marketValue - The current market value of the card
     * @returns {number} - The value to this trader (as a multiplier of market value)
     */
    evaluateCardValue(card, instance, marketValue) {
        const personalityType = this.personality;
        let valueMultiplier = 1.0;
        
        // Base evaluation on personality interests
        if (card.rarity === "Ultra Rare" || card.rarity === "Secret Rare") {
            valueMultiplier += personalityType.interests.highRarity;
        }
        
        // Condition affects value
        if (instance.condition === "Mint") {
            valueMultiplier += personalityType.interests.condition * 0.2;
        } else if (instance.condition === "Near Mint") {
            valueMultiplier += personalityType.interests.condition * 0.1;
        } else if (instance.condition === "Poor" || instance.condition === "Fair") {
            valueMultiplier -= personalityType.interests.condition * 0.1;
        }
        
        // Special interests
        if (this.specialInterests.cards && this.specialInterests.cards.includes(card.id)) {
            valueMultiplier += 0.5; // 50% more valuable if specifically interested
        }
        
        if (this.specialInterests.sets && this.specialInterests.sets.includes(card.set)) {
            valueMultiplier += 0.3; // 30% more valuable if from a set they're interested in
        }
        
        // Graded cards are more valuable
        if (instance.graded) {
            valueMultiplier += 0.1 * instance.graded; // 10% per grade point
        }
        
        // Protection affects value
        if (instance.protected.sleeved) valueMultiplier += 0.05;
        if (instance.protected.toploader) valueMultiplier += 0.1;
        
        return marketValue * valueMultiplier;
    }
    
    /**
     * Determine if this trader wants to make an offer for a card
     * @param {Object} card - The card data
     * @param {Object} instance - The specific card instance
     * @param {number} marketValue - The current market value of the card
     * @returns {boolean} - Whether the trader is interested
     */
    isInterestedIn(card, instance, marketValue) {
        // Check if trader already has too many of this card
        if (this.inventory[card.id] && this.inventory[card.id].length >= 3) {
            // Collectors might want more than 3 of a card
            if (this.personality !== TRADER_PERSONALITIES.COLLECTOR) {
                return false;
            }
        }
        
        // Check if trader can afford it
        const perceivedValue = this.evaluateCardValue(card, instance, marketValue);
        if (perceivedValue > this.cash * 0.8) {
            return false; // Won't spend more than 80% of cash on one card
        }
        
        // Different personalities have different interests
        const personalityType = this.personality;
        let interestChance = 0.3; // Base chance
        
        // Adjust based on rarity
        switch (card.rarity) {
            case "Common":
                interestChance += personalityType === TRADER_PERSONALITIES.CASUAL ? 0.3 : 0;
                break;
            case "Uncommon":
                interestChance += personalityType === TRADER_PERSONALITIES.CASUAL ? 0.2 : 0.1;
                break;
            case "Rare":
                interestChance += 0.2;
                break;
            case "Ultra Rare":
                interestChance += personalityType === TRADER_PERSONALITIES.COLLECTOR || 
                                 personalityType === TRADER_PERSONALITIES.INVESTOR ? 0.4 : 0.2;
                break;
            case "Secret Rare":
                interestChance += personalityType === TRADER_PERSONALITIES.COLLECTOR || 
                                 personalityType === TRADER_PERSONALITIES.INVESTOR ? 0.6 : 0.3;
                break;
        }
        
        // Special interests greatly increase chance
        if (this.specialInterests.cards && this.specialInterests.cards.includes(card.id)) {
            interestChance += 0.5;
        }
        
        if (this.specialInterests.sets && this.specialInterests.sets.includes(card.set)) {
            interestChance += 0.3;
        }
        
        return Math.random() < Math.min(interestChance, 0.9); // Cap at 90% chance
    }
    
    /**
     * Generate an offer for a card
     * @param {Object} card - The card data
     * @param {Object} instance - The specific card instance
     * @param {number} marketValue - The current market value of the card
     * @returns {Object} - The offer details
     */
    generateOffer(card, instance, marketValue) {
        const perceivedValue = this.evaluateCardValue(card, instance, marketValue);
        const initialOfferMultiplier = this.personality.negotiation.initialOffer;
        
        return {
            cash: perceivedValue * initialOfferMultiplier,
            cards: [], // Could offer cards in trade too
            message: this.generateOfferMessage(card, perceivedValue * initialOfferMultiplier)
        };
    }
    
    /**
     * Generate a message for an offer based on personality
     */
    generateOfferMessage(card, offerAmount) {
        const personalityType = this.personality;
        const messages = {
            COLLECTOR: [
                `I've been looking for this ${card.name} for my collection! I can offer $${offerAmount.toFixed(2)}.`,
                `This would fit perfectly in my collection. How about $${offerAmount.toFixed(2)}?`,
                `I need this for my set! Would you take $${offerAmount.toFixed(2)} for it?`
            ],
            INVESTOR: [
                `This card has potential. I'll give you $${offerAmount.toFixed(2)} for it.`,
                `I see value in this ${card.name}. $${offerAmount.toFixed(2)} seems fair.`,
                `This could appreciate nicely. I'm willing to pay $${offerAmount.toFixed(2)}.`
            ],
            CASUAL: [
                `Hey, cool ${card.name}! Would you take $${offerAmount.toFixed(2)} for it?`,
                `I like this one! How about $${offerAmount.toFixed(2)}?`,
                `That's a neat card. $${offerAmount.toFixed(2)} sound good?`
            ],
            COMPETITIVE: [
                `This ${card.name} would strengthen my collection. $${offerAmount.toFixed(2)} for it?`,
                `I could use this. I'll offer $${offerAmount.toFixed(2)}.`,
                `This has potential. $${offerAmount.toFixed(2)} is my offer.`
            ]
        };
        
        const personalityKey = Object.keys(TRADER_PERSONALITIES).find(
            key => TRADER_PERSONALITIES[key] === personalityType
        );
        
        const messageArray = messages[personalityKey] || messages.CASUAL;
        return messageArray[Math.floor(Math.random() * messageArray.length)];
    }
    
    /**
     * Evaluate a counter offer
     * @param {Object} originalOffer - The original offer made by this trader
     * @param {Object} counterOffer - The counter offer from the player
     * @param {Object} card - The card being traded
     * @param {number} marketValue - The market value of the card
     * @returns {Object} - Response to the counter offer
     */
    evaluateCounterOffer(originalOffer, counterOffer, card, marketValue) {
        const perceivedValue = this.evaluateCardValue(card, card.instance, marketValue);
        const counterThreshold = this.personality.negotiation.counterThreshold;
        
        // Calculate the difference as a percentage of perceived value
        const offerDifference = (counterOffer.cash - originalOffer.cash) / perceivedValue;
        
        // If counter offer is acceptable
        if (counterOffer.cash <= perceivedValue * (1 + (1 - counterThreshold))) {
            return {
                accepted: true,
                message: this.generateAcceptMessage(card),
                finalOffer: counterOffer
            };
        }
        
        // If counter offer is too high but within negotiation range
        if (offerDifference < 0.3) { // Not more than 30% higher than original offer
            const newOfferAmount = originalOffer.cash * (1 + offerDifference/2);
            return {
                accepted: false,
                message: this.generateCounterMessage(card, newOfferAmount),
                finalOffer: {
                    cash: newOfferAmount,
                    cards: []
                }
            };
        }
        
        // If counter offer is way too high
        return {
            accepted: false,
            message: this.generateRejectMessage(card),
            finalOffer: null
        };
    }
    
    /**
     * Generate acceptance message
     */
    generateAcceptMessage(card) {
        const messages = [
            `Deal! This ${card.name} will make a fine addition to my collection.`,
            `Agreed! Pleasure doing business with you.`,
            `That works for me. Thanks for the trade!`,
            `Perfect! I'm happy with this deal.`
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    /**
     * Generate counter offer message
     */
    generateCounterMessage(card, amount) {
        const messages = [
            `Hmm, that's a bit high. How about $${amount.toFixed(2)} instead?`,
            `I can't go that high. Would you accept $${amount.toFixed(2)}?`,
            `Let's meet in the middle at $${amount.toFixed(2)}.`,
            `That's more than I was hoping to spend. Could we do $${amount.toFixed(2)}?`
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    /**
     * Generate rejection message
     */
    generateRejectMessage(card) {
        const messages = [
            `Sorry, that's way too much for me. I'll have to pass.`,
            `That's well above what I can offer. No deal.`,
            `I don't think we're going to reach an agreement. Maybe next time.`,
            `That's outside my budget. I'll have to decline.`
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    /**
     * Complete a trade
     * @param {Object} trade - The trade details
     */
    completeTrade(trade) {
        // Update cash
        this.cash -= trade.cashAmount;
        
        // Add card to inventory
        const cardId = trade.card.id;
        if (!this.inventory[cardId]) {
            this.inventory[cardId] = [];
        }
        this.inventory[cardId].push(trade.card.instance);
        
        // Add to trade history
        this.tradeHistory.push({
            date: { year: gameState.date.year, day: gameState.date.day },
            card: trade.card,
            cashAmount: trade.cashAmount,
            type: 'purchase'
        });
        
        // Update reputation based on fair value
        const fairValue = calculateCardValue(trade.card, trade.card.instance);
        const priceDifference = (fairValue - trade.cashAmount) / fairValue;
        
        if (priceDifference > 0.2) {
            // Player gave a good deal
            this.reputation = Math.min(100, this.reputation + 5);
        } else if (priceDifference < -0.2) {
            // Player overcharged
            this.reputation = Math.max(0, this.reputation - 5);
        }
    }
}

/**
 * Generate a set of AI traders
 * @returns {Array} - Array of AI trader objects
 */
function generateTraders() {
    const traderNames = [
        "Alex Morgan", "Jordan Chen", "Taylor Kim", "Casey Smith", 
        "Morgan Riley", "Jamie Wong", "Quinn Johnson", "Avery Davis",
        "Riley Thompson", "Cameron Lee", "Jordan Taylor", "Casey Morgan"
    ];
    
    const traders = [];
    
    // Create one trader of each personality type
    Object.values(TRADER_PERSONALITIES).forEach((personality, index) => {
        const name = traderNames[index];
        const trader = new AITrader(name, personality);
        
        // Add special interests
        trader.specialInterests = generateSpecialInterests();
        
        // Generate inventory
        trader.generateInventory(TCG_CARDS);
        
        traders.push(trader);
    });
    
    // Create additional traders with random personalities
    for (let i = Object.values(TRADER_PERSONALITIES).length; i < 8; i++) {
        const personalityKeys = Object.keys(TRADER_PERSONALITIES);
        const randomPersonality = TRADER_PERSONALITIES[personalityKeys[Math.floor(Math.random() * personalityKeys.length)]];
        
        const name = traderNames[i];
        const trader = new AITrader(name, randomPersonality);
        
        // Add special interests
        trader.specialInterests = generateSpecialInterests();
        
        // Generate inventory
        trader.generateInventory(TCG_CARDS);
        
        traders.push(trader);
    }
    
    return traders;
}

/**
 * Generate special interests for a trader
 * @returns {Object} - Special interests object
 */
function generateSpecialInterests() {
    const interests = {
        cards: [],
        sets: []
    };
    
    // Random chance to be interested in specific cards
    const cardIds = Object.keys(TCG_CARDS);
    const numInterestedCards = Math.floor(Math.random() * 5) + 1; // 1-5 cards
    
    for (let i = 0; i < numInterestedCards; i++) {
        const randomCardId = cardIds[Math.floor(Math.random() * cardIds.length)];
        if (!interests.cards.includes(randomCardId)) {
            interests.cards.push(randomCardId);
        }
    }
    
    // Random chance to be interested in specific sets
    const sets = Object.keys(TCG_SETS);
    const numInterestedSets = Math.floor(Math.random() * 2) + 1; // 1-2 sets
    
    for (let i = 0; i < numInterestedSets; i++) {
        const randomSet = sets[Math.floor(Math.random() * sets.length)];
        if (!interests.sets.includes(randomSet)) {
            interests.sets.push(randomSet);
        }
    }
    
    return interests;
}

/**
 * Initialize the trading system
 */
function initializeTradingSystem() {
    // Generate AI traders if they don't exist
    if (!gameState.traders || gameState.traders.length === 0) {
        gameState.traders = generateTraders();
    }
    
    // Add trading system to game state
    gameState.trading = {
        currentTrader: null,
        selectedPlayerCards: [],
        selectedTraderCards: [],
        cashOffer: 0,
        tradeHistory: []
    };
    
    // Add event listeners for trading UI
    setupTradingEventListeners();
}

/**
 * Set up event listeners for trading UI
 */
function setupTradingEventListeners() {
    // Will be implemented when trading UI is created
}

/**
 * Render the trading view
 */
function renderTradingView() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = '';
    
    // Create trading view container
    const tradingView = document.createElement('div');
    tradingView.className = 'trading-view';
    
    // Create trader selection section
    const traderSelectionSection = document.createElement('div');
    traderSelectionSection.className = 'trader-selection-section';
    traderSelectionSection.innerHTML = `
        <h2 class="section-title">Trading Partners</h2>
        <div class="trader-list" id="trader-list"></div>
    `;
    tradingView.appendChild(traderSelectionSection);
    
    // Add trading view to main view
    mainView.appendChild(tradingView);
    
    // Render trader list
    renderTraderList();
}

/**
 * Render the list of available traders
 */
function renderTraderList() {
    const traderList = document.getElementById('trader-list');
    if (!traderList) return;
    
    traderList.innerHTML = '';
    
    gameState.traders.forEach(trader => {
        const traderCard = document.createElement('div');
        traderCard.className = 'trader-card';
        traderCard.style.borderColor = trader.personality.color;
        
        traderCard.innerHTML = `
            <div class="trader-avatar">
                <img src="${trader.avatar}" alt="${trader.name}">
            </div>
            <div class="trader-info">
                <h3 class="trader-name">${trader.name}</h3>
                <div class="trader-personality">${trader.personality.name}</div>
                <div class="trader-description">${trader.personality.description}</div>
                <div class="trader-reputation">
                    <div class="reputation-label">Reputation:</div>
                    <div class="reputation-bar">
                        <div class="reputation-fill" style="width: ${trader.reputation}%; background-color: ${getReputationColor(trader.reputation)}"></div>
                    </div>
                </div>
                <div class="trader-cash">Cash: $${trader.cash.toFixed(2)}</div>
                <div class="trader-collection">Collection: ${countTraderCards(trader)} cards</div>
            </div>
            <button class="trade-button" data-trader-index="${gameState.traders.indexOf(trader)}">Trade</button>
        `;
        
        traderList.appendChild(traderCard);
    });
    
    // Add event listeners to trade buttons
    document.querySelectorAll('.trade-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const traderIndex = parseInt(e.target.dataset.traderIndex);
            startTradeWithTrader(traderIndex);
        });
    });
}

/**
 * Get color for reputation bar
 * @param {number} reputation - Reputation value (0-100)
 * @returns {string} - CSS color value
 */
function getReputationColor(reputation) {
    if (reputation >= 80) return '#27ae60'; // Green
    if (reputation >= 60) return '#2ecc71'; // Light green
    if (reputation >= 40) return '#f39c12'; // Orange
    if (reputation >= 20) return '#e67e22'; // Dark orange
    return '#e74c3c'; // Red
}

/**
 * Count the total number of cards in a trader's inventory
 * @param {Object} trader - The trader object
 * @returns {number} - Total card count
 */
function countTraderCards(trader) {
    return Object.values(trader.inventory).reduce((total, cards) => total + cards.length, 0);
}

/**
 * Start a trade with a specific trader
 * @param {number} traderIndex - Index of the trader in gameState.traders
 */
function startTradeWithTrader(traderIndex) {
    gameState.trading.currentTrader = gameState.traders[traderIndex];
    renderTradeInterface();
}

/**
 * Render the trade interface
 */
function renderTradeInterface() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = '';
    
    const trader = gameState.trading.currentTrader;
    if (!trader) return;
    
    // Create trade interface container
    const tradeInterface = document.createElement('div');
    tradeInterface.className = 'trade-interface';
    
    // Header with trader info
    tradeInterface.innerHTML = `
        <div class="trade-header">
            <button id="back-to-traders" class="back-button">← Back to Traders</button>
            <div class="trader-summary">
                <img src="${trader.avatar}" alt="${trader.name}" class="trader-avatar-small">
                <div class="trader-header-info">
                    <h2 class="trader-name">${trader.name}</h2>
                    <div class="trader-personality">${trader.personality.name}</div>
                </div>
            </div>
        </div>
        
        <div class="trade-content">
            <div class="trade-side player-side">
                <h3 class="side-title">Your Offer</h3>
                <div class="cash-offer">
                    <label for="player-cash-offer">Cash Offer:</label>
                    <div class="cash-input-container">
                        <span class="cash-symbol">$</span>
                        <input type="number" id="player-cash-offer" min="0" step="0.01" value="0.00">
                    </div>
                </div>
                <div class="card-selection">
                    <h4>Your Cards</h4>
                    <div class="card-filter">
                        <input type="text" id="player-card-filter" placeholder="Filter cards...">
                    </div>
                    <div class="card-grid" id="player-card-grid"></div>
                </div>
                <div class="selected-cards">
                    <h4>Selected Cards</h4>
                    <div class="selected-card-list" id="player-selected-cards"></div>
                </div>
            </div>
            
            <div class="trade-controls">
                <button id="make-offer-btn" class="offer-button">Make Offer</button>
                <div class="trade-status" id="trade-status"></div>
            </div>
            
            <div class="trade-side trader-side">
                <h3 class="side-title">${trader.name}'s Offer</h3>
                <div class="cash-offer">
                    <label>Cash Offer:</label>
                    <div class="cash-display" id="trader-cash-offer">$0.00</div>
                </div>
                <div class="card-selection">
                    <h4>${trader.name}'s Cards</h4>
                    <div class="card-filter">
                        <input type="text" id="trader-card-filter" placeholder="Filter cards...">
                    </div>
                    <div class="card-grid" id="trader-card-grid"></div>
                </div>
                <div class="selected-cards">
                    <h4>Selected Cards</h4>
                    <div class="selected-card-list" id="trader-selected-cards"></div>
                </div>
            </div>
        </div>
    `;
    
    mainView.appendChild(tradeInterface);
    
    // Add event listeners
    document.getElementById('back-to-traders').addEventListener('click', renderTradingView);
    document.getElementById('make-offer-btn').addEventListener('click', makeOffer);
    document.getElementById('player-card-filter').addEventListener('input', filterPlayerCards);
    document.getElementById('trader-card-filter').addEventListener('input', filterTraderCards);
    
    // Render cards
    renderPlayerCards();
    renderTraderCards();
}

/**
 * Render player's cards in the trade interface
 */
function renderPlayerCards() {
    const playerCardGrid = document.getElementById('player-card-grid');
    if (!playerCardGrid) return;
    
    playerCardGrid.innerHTML = '';
    
    // Get player's collection
    const collection = gameState.player.collection;
    
    // Render each card
    Object.entries(collection).forEach(([cardId, instances]) => {
        instances.forEach(instance => {
            const card = TCG_CARDS[cardId];
            if (!card) return;
            
            const cardElement = buildCardElement(card, instance);
            cardElement.classList.add('trade-card');
            
            // Add click event to select/deselect card
            cardElement.addEventListener('click', () => {
                togglePlayerCardSelection(cardId, instance);
                cardElement.classList.toggle('selected');
            });
            
            playerCardGrid.appendChild(cardElement);
        });
    });
}

/**
 * Render trader's cards in the trade interface
 */
function renderTraderCards() {
    const traderCardGrid = document.getElementById('trader-card-grid');
    if (!traderCardGrid) return;
    
    traderCardGrid.innerHTML = '';
    
    const trader = gameState.trading.currentTrader;
    if (!trader) return;
    
    // Render each card in trader's inventory
    Object.entries(trader.inventory).forEach(([cardId, instances]) => {
        instances.forEach(instance => {
            const card = TCG_CARDS[cardId];
            if (!card) return;
            
            const cardElement = buildCardElement(card, instance);
            cardElement.classList.add('trade-card');
            
            // Add click event to select/deselect card
            cardElement.addEventListener('click', () => {
                toggleTraderCardSelection(cardId, instance);
                cardElement.classList.toggle('selected');
            });
            
            traderCardGrid.appendChild(cardElement);
        });
    });
}

/**
 * Toggle selection of a player card for trading
 * @param {string} cardId - The card ID
 * @param {Object} instance - The card instance
 */
function togglePlayerCardSelection(cardId, instance) {
    const selectedCards = gameState.trading.selectedPlayerCards;
    const existingIndex = selectedCards.findIndex(c => c.instance.uid === instance.uid);
    
    if (existingIndex >= 0) {
        // Remove from selection
        selectedCards.splice(existingIndex, 1);
    } else {
        // Add to selection
        selectedCards.push({
            id: cardId,
            instance: instance
        });
    }
    
    // Update selected cards display
    updateSelectedCardsDisplay();
}

/**
 * Toggle selection of a trader card for trading
 * @param {string} cardId - The card ID
 * @param {Object} instance - The card instance
 */
function toggleTraderCardSelection(cardId, instance) {
    const selectedCards = gameState.trading.selectedTraderCards;
    const existingIndex = selectedCards.findIndex(c => c.instance.uid === instance.uid);
    
    if (existingIndex >= 0) {
        // Remove from selection
        selectedCards.splice(existingIndex, 1);
    } else {
        // Add to selection
        selectedCards.push({
            id: cardId,
            instance: instance
        });
    }
    
    // Update selected cards display
    updateSelectedCardsDisplay();
}

/**
 * Update the display of selected cards
 */
function updateSelectedCardsDisplay() {
    // Update player selected cards
    const playerSelectedCards = document.getElementById('player-selected-cards');
    if (playerSelectedCards) {
        playerSelectedCards.innerHTML = '';
        
        gameState.trading.selectedPlayerCards.forEach(card => {
            const cardInfo = TCG_CARDS[card.id];
            const miniCard = document.createElement('div');
            miniCard.className = 'mini-card';
            miniCard.innerHTML = `
                <img src="${cardInfo.img}" alt="${cardInfo.name}" class="mini-card-img">
                <div class="mini-card-info">
                    <div class="mini-card-name">${cardInfo.name}</div>
                    <div class="mini-card-condition">${card.instance.condition}</div>
                </div>
                <button class="remove-card" data-uid="${card.instance.uid}">×</button>
            `;
            playerSelectedCards.appendChild(miniCard);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.player-side .remove-card').forEach(button => {
            button.addEventListener('click', (e) => {
                const uid = e.target.dataset.uid;
                const index = gameState.trading.selectedPlayerCards.findIndex(c => c.instance.uid === uid);
                if (index >= 0) {
                    gameState.trading.selectedPlayerCards.splice(index, 1);
                    updateSelectedCardsDisplay();
                    
                    // Also update the selection in the grid
                    const cardElement = document.querySelector(`.player-side .trade-card[data-instance-uid="${uid}"]`);
                    if (cardElement) {
                        cardElement.classList.remove('selected');
                    }
                }
            });
        });
    }
    
    // Update trader selected cards
    const traderSelectedCards = document.getElementById('trader-selected-cards');
    if (traderSelectedCards) {
        traderSelectedCards.innerHTML = '';
        
        gameState.trading.selectedTraderCards.forEach(card => {
            const cardInfo = TCG_CARDS[card.id];
            const miniCard = document.createElement('div');
            miniCard.className = 'mini-card';
            miniCard.innerHTML = `
                <img src="${cardInfo.img}" alt="${cardInfo.name}" class="mini-card-img">
                <div class="mini-card-info">
                    <div class="mini-card-name">${cardInfo.name}</div>
                    <div class="mini-card-condition">${card.instance.condition}</div>
                </div>
                <button class="remove-card" data-uid="${card.instance.uid}">×</button>
            `;
            traderSelectedCards.appendChild(miniCard);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.trader-side .remove-card').forEach(button => {
            button.addEventListener('click', (e) => {
                const uid = e.target.dataset.uid;
                const index = gameState.trading.selectedTraderCards.findIndex(c => c.instance.uid === uid);
                if (index >= 0) {
                    gameState.trading.selectedTraderCards.splice(index, 1);
                    updateSelectedCardsDisplay();
                    
                    // Also update the selection in the grid
                    const cardElement = document.querySelector(`.trader-side .trade-card[data-instance-uid="${uid}"]`);
                    if (cardElement) {
                        cardElement.classList.remove('selected');
                    }
                }
            });
        });
    }
}

/**
 * Filter player cards based on search input
 */
function filterPlayerCards() {
    const filterText = document.getElementById('player-card-filter').value.toLowerCase();
    const cards = document.querySelectorAll('#player-card-grid .trade-card');
    
    cards.forEach(card => {
        const cardId = card.dataset.cardId;
        const cardInfo = TCG_CARDS[cardId];
        
        if (cardInfo.name.toLowerCase().includes(filterText) || 
            cardInfo.rarity.toLowerCase().includes(filterText)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Filter trader cards based on search input
 */
function filterTraderCards() {
    const filterText = document.getElementById('trader-card-filter').value.toLowerCase();
    const cards = document.querySelectorAll('#trader-card-grid .trade-card');
    
    cards.forEach(card => {
        const cardId = card.dataset.cardId;
        const cardInfo = TCG_CARDS[cardId];
        
        if (cardInfo.name.toLowerCase().includes(filterText) || 
            cardInfo.rarity.toLowerCase().includes(filterText)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Make an offer to the trader
 */
function makeOffer() {
    const trader = gameState.trading.currentTrader;
    if (!trader) return;
    
    const playerCashOffer = parseFloat(document.getElementById('player-cash-offer').value) || 0;
    const playerCards = gameState.trading.selectedPlayerCards;
    const traderCards = gameState.trading.selectedTraderCards;
    
    // Validate the offer
    if (playerCashOffer > gameState.player.cash) {
        showTradeStatus("You don't have enough cash for this offer.", 'error');
        return;
    }
    
    if (playerCards.length === 0 && traderCards.length === 0) {
        showTradeStatus("You need to select at least one card to trade.", 'error');
        return;
    }
    
    // Calculate values
    let playerOfferValue = playerCashOffer;
    let traderOfferValue = 0;
    
    // Add player card values
    playerCards.forEach(card => {
        const cardInfo = TCG_CARDS[card.id];
        playerOfferValue += calculateCardValue(cardInfo, card.instance);
    });
    
    // Add trader card values and check if trader can afford it
    traderCards.forEach(card => {
        const cardInfo = TCG_CARDS[card.id];
        const cardValue = calculateCardValue(cardInfo, card.instance);
        traderOfferValue += cardValue;
    });
    
    // Check if trader can afford the cash difference
    const cashDifference = playerOfferValue - traderOfferValue;
    if (cashDifference > trader.cash) {
        showTradeStatus(`${trader.name} can't afford this trade. They only have $${trader.cash.toFixed(2)}.`, 'error');
        return;
    }
    
    // Evaluate the offer based on trader personality
    const offerEvaluation = evaluateTradeOffer(trader, playerOfferValue, traderOfferValue, playerCards, traderCards);
    
    // Show trader response
    showTraderResponse(offerEvaluation);
}

/**
 * Calculate the value of a card
 * @param {Object} card - The card data
 * @param {Object} instance - The card instance
 * @returns {number} - The card value
 */
function calculateCardValue(card, instance) {
    // Base value from card rarity
    let value = 0;
    
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
    
    // Adjust for grading
    if (instance.graded) {
        value *= (1 + (instance.graded / 10)); // Grade 10 doubles value
    }
    
    // Apply any market modifiers
    if (gameState.market && gameState.market.priceModifiers) {
        const rarityMod = gameState.market.priceModifiers[card.rarity] || 1;
        const cardMod = gameState.market.priceModifiers[card.id] || 1;
        const setMod = gameState.market.priceModifiers[card.set] || 1;
        
        value *= rarityMod * cardMod * setMod;
    }
    
    return value;
}

/**
 * Evaluate a trade offer based on trader personality
 * @param {Object} trader - The trader object
 * @param {number} playerOfferValue - Total value of player's offer
 * @param {number} traderOfferValue - Total value of trader's offer
 * @param {Array} playerCards - Cards offered by player
 * @param {Array} traderCards - Cards offered by trader
 * @returns {Object} - Evaluation result
 */
function evaluateTradeOffer(trader, playerOfferValue, traderOfferValue, playerCards, traderCards) {
    const personality = trader.personality;
    const valueDifference = traderOfferValue - playerOfferValue;
    const valueDifferencePercent = valueDifference / traderOfferValue;
    
    // Base acceptance threshold based on personality
    let acceptanceThreshold = personality.negotiation.counterThreshold;
    
    // Adjust for reputation
    if (trader.reputation > 75) {
        acceptanceThreshold -= 0.05; // More lenient if reputation is high
    } else if (trader.reputation < 25) {
        acceptanceThreshold += 0.05; // Less lenient if reputation is low
    }
    
    // Check for special interests in the cards being offered
    playerCards.forEach(card => {
        if (trader.specialInterests.cards && trader.specialInterests.cards.includes(card.id)) {
            acceptanceThreshold -= 0.1; // More likely to accept if player offers cards they're interested in
        }
        
        const cardInfo = TCG_CARDS[card.id];
        if (trader.specialInterests.sets && trader.specialInterests.sets.includes(cardInfo.set)) {
            acceptanceThreshold -= 0.05; // More likely to accept if player offers cards from sets they're interested in
        }
    });
    
    // Evaluate the offer
    if (valueDifferencePercent <= (1 - acceptanceThreshold)) {
        // Trader accepts the offer
        return {
            accepted: true,
            message: generateAcceptMessage(trader, playerCards, traderCards),
            cashDifference: valueDifference
        };
    } else if (valueDifferencePercent <= 0.3) {
        // Trader makes a counter offer
        const counterOfferCash = valueDifference * 0.8; // Ask for 80% of the difference
        
        return {
            accepted: false,
            counterOffer: true,
            message: generateCounterOfferMessage(trader, counterOfferCash),
            suggestedCash: counterOfferCash
        };
    } else {
        // Trader rejects the offer
        return {
            accepted: false,
            counterOffer: false,
            message: generateRejectMessage(trader)
        };
    }
}

/**
 * Generate acceptance message for a trade
 */
function generateAcceptMessage(trader, playerCards, traderCards) {
    const personality = trader.personality;
    const personalityType = Object.keys(TRADER_PERSONALITIES).find(
        key => TRADER_PERSONALITIES[key] === personality
    );
    
    const messages = {
        COLLECTOR: [
            "Great addition to my collection! Deal!",
            "This completes my set perfectly. I accept!",
            "I've been looking for these. We have a deal!"
        ],
        INVESTOR: [
            "The numbers work out. Deal accepted.",
            "This is a sound investment. I'll take it.",
            "The value proposition is acceptable. We have a deal."
        ],
        CASUAL: [
            "Sounds good to me! Deal!",
            "I like this trade. Let's do it!",
            "Sure, why not? Deal!"
        ],
        COMPETITIVE: [
            "This strengthens my collection. Deal accepted.",
            "These cards will serve me well. I accept.",
            "A strategic acquisition. We have a deal."
        ]
    };
    
    const messageArray = messages[personalityType] || messages.CASUAL;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
}

/**
 * Generate counter offer message
 */
function generateCounterOfferMessage(trader, counterOfferCash) {
    const personality = trader.personality;
    const personalityType = Object.keys(TRADER_PERSONALITIES).find(
        key => TRADER_PERSONALITIES[key] === personality
    );
    
    const messages = {
        COLLECTOR: [
            `Almost there, but I need $${counterOfferCash.toFixed(2)} more to make it fair.`,
            `I'm interested, but could you add $${counterOfferCash.toFixed(2)} to balance the trade?`,
            `For my collection, I'd need an additional $${counterOfferCash.toFixed(2)}.`
        ],
        INVESTOR: [
            `The numbers don't quite add up. Add $${counterOfferCash.toFixed(2)} and we have a deal.`,
            `I calculate a value discrepancy of $${counterOfferCash.toFixed(2)}. Can you cover that?`,
            `From an investment perspective, I need $${counterOfferCash.toFixed(2)} more.`
        ],
        CASUAL: [
            `How about adding $${counterOfferCash.toFixed(2)} to make it even?`,
            `Could you throw in another $${counterOfferCash.toFixed(2)}? Then we're good!`,
            `Just need $${counterOfferCash.toFixed(2)} more and it's a deal!`
        ],
        COMPETITIVE: [
            `Add $${counterOfferCash.toFixed(2)} to balance the strategic value.`,
            `I require $${counterOfferCash.toFixed(2)} additional compensation.`,
            `$${counterOfferCash.toFixed(2)} more would make this trade acceptable.`
        ]
    };
    
    const messageArray = messages[personalityType] || messages.CASUAL;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
}

/**
 * Generate rejection message
 */
function generateRejectMessage(trader) {
    const personality = trader.personality;
    const personalityType = Object.keys(TRADER_PERSONALITIES).find(
        key => TRADER_PERSONALITIES[key] === personality
    );
    
    const messages = {
        COLLECTOR: [
            "Sorry, that doesn't help my collection enough.",
            "I'm looking for different cards for my collection.",
            "The value just isn't there for my collection needs."
        ],
        INVESTOR: [
            "The numbers don't work out. I'll have to decline.",
            "This doesn't meet my investment criteria.",
            "The ROI is insufficient. No deal."
        ],
        CASUAL: [
            "I'll pass on this one, thanks.",
            "Not really what I'm looking for right now.",
            "I don't think this works for me. Sorry!"
        ],
        COMPETITIVE: [
            "This doesn't strengthen my position. I decline.",
            "These cards don't meet my strategic needs.",
            "I need better value. Offer declined."
        ]
    };
    
    const messageArray = messages[personalityType] || messages.CASUAL;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
}

/**
 * Show trader response to an offer
 * @param {Object} evaluation - The offer evaluation
 */
function showTraderResponse(evaluation) {
    const tradeStatus = document.getElementById('trade-status');
    if (!tradeStatus) return;
    
    const trader = gameState.trading.currentTrader;
    
    if (evaluation.accepted) {
        // Accepted offer
        tradeStatus.innerHTML = `
            <div class="trade-response accepted">
                <div class="trader-message">
                    <img src="${trader.avatar}" alt="${trader.name}" class="trader-avatar-tiny">
                    <div class="message-bubble">
                        <p>${evaluation.message}</p>
                    </div>
                </div>
                <button id="complete-trade-btn" class="complete-trade-btn">Complete Trade</button>
            </div>
        `;
        
        // Add event listener to complete trade button
        document.getElementById('complete-trade-btn').addEventListener('click', () => {
            completeTrade(evaluation.cashDifference);
        });
    } else if (evaluation.counterOffer) {
        // Counter offer
        tradeStatus.innerHTML = `
            <div class="trade-response counter">
                <div class="trader-message">
                    <img src="${trader.avatar}" alt="${trader.name}" class="trader-avatar-tiny">
                    <div class="message-bubble">
                        <p>${evaluation.message}</p>
                    </div>
                </div>
                <div class="counter-offer-actions">
                    <button id="accept-counter-btn" class="accept-counter-btn">Accept Counter Offer</button>
                    <button id="reject-counter-btn" class="reject-counter-btn">Reject</button>
                </div>
            </div>
        `;
        
        // Add event listeners for counter offer buttons
        document.getElementById('accept-counter-btn').addEventListener('click', () => {
            // Update player cash offer
            const currentCashOffer = parseFloat(document.getElementById('player-cash-offer').value) || 0;
            document.getElementById('player-cash-offer').value = (currentCashOffer + evaluation.suggestedCash).toFixed(2);
            
            // Complete the trade with the new cash amount
            completeTrade(0); // No additional cash difference since we've already adjusted the offer
        });
        
        document.getElementById('reject-counter-btn').addEventListener('click', () => {
            showTradeStatus("You rejected the counter offer.", 'info');
        });
    } else {
        // Rejected offer
        tradeStatus.innerHTML = `
            <div class="trade-response rejected">
                <div class="trader-message">
                    <img src="${trader.avatar}" alt="${trader.name}" class="trader-avatar-tiny">
                    <div class="message-bubble">
                        <p>${evaluation.message}</p>
                    </div>
                </div>
                <button id="try-again-btn" class="try-again-btn">Revise Offer</button>
            </div>
        `;
        
        // Add event listener to try again button
        document.getElementById('try-again-btn').addEventListener('click', () => {
            showTradeStatus("", 'clear');
        });
    }
}

/**
 * Show a status message in the trade interface
 * @param {string} message - The message to show
 * @param {string} type - The message type (error, success, info, clear)
 */
function showTradeStatus(message, type) {
    const tradeStatus = document.getElementById('trade-status');
    if (!tradeStatus) return;
    
    if (type === 'clear') {
        tradeStatus.innerHTML = '';
        return;
    }
    
    tradeStatus.innerHTML = `
        <div class="status-message ${type}">
            ${message}
        </div>
    `;
}

/**
 * Complete a trade
 * @param {number} cashDifference - The cash difference to be paid/received
 */
function completeTrade(cashDifference) {
    const trader = gameState.trading.currentTrader;
    if (!trader) return;
    
    const playerCashOffer = parseFloat(document.getElementById('player-cash-offer').value) || 0;
    const playerCards = gameState.trading.selectedPlayerCards;
    const traderCards = gameState.trading.selectedTraderCards;
    
    // Transfer cash
    gameState.player.cash -= playerCashOffer;
    trader.cash += playerCashOffer;
    
    if (cashDifference > 0) {
        // Player receives cash
        gameState.player.cash += cashDifference;
        trader.cash -= cashDifference;
    }
    
    // Transfer cards from player to trader
    playerCards.forEach(card => {
        // Remove from player's collection
        const cardId = card.id;
        const instanceUid = card.instance.uid;
        
        const cardIndex = gameState.player.collection[cardId].findIndex(c => c.uid === instanceUid);
        if (cardIndex >= 0) {
            const removedCard = gameState.player.collection[cardId].splice(cardIndex, 1)[0];
            
            // Add to trader's inventory
            if (!trader.inventory[cardId]) {
                trader.inventory[cardId] = [];
            }
            trader.inventory[cardId].push(removedCard);
        }
    });
    
    // Transfer cards from trader to player
    traderCards.forEach(card => {
        // Remove from trader's inventory
        const cardId = card.id;
        const instanceUid = card.instance.uid;
        
        const cardIndex = trader.inventory[cardId].findIndex(c => c.uid === instanceUid);
        if (cardIndex >= 0) {
            const removedCard = trader.inventory[cardId].splice(cardIndex, 1)[0];
            
            // Add to player's collection
            if (!gameState.player.collection[cardId]) {
                gameState.player.collection[cardId] = [];
            }
            gameState.player.collection[cardId].push(removedCard);
        }
    });
    
    // Record the trade in history
    const tradeRecord = {
        date: { year: gameState.date.year, day: gameState.date.day },
        trader: trader.name,
        playerGave: {
            cash: playerCashOffer,
            cards: playerCards.map(c => ({ id: c.id, name: TCG_CARDS[c.id].name }))
        },
        playerReceived: {
            cash: cashDifference > 0 ? cashDifference : 0,
            cards: traderCards.map(c => ({ id: c.id, name: TCG_CARDS[c.id].name }))
        }
    };
    
    gameState.trading.tradeHistory.push(tradeRecord);
    
    // Update trader reputation based on fairness
    updateTraderReputation(trader, playerCards, traderCards, playerCashOffer, cashDifference);
    
    // Show success message
    showTradeStatus("Trade completed successfully!", 'success');
    
    // Reset selected cards
    gameState.trading.selectedPlayerCards = [];
    gameState.trading.selectedTraderCards = [];
    
    // Update UI
    updateUI();
    
    // Return to trading view after a delay
    setTimeout(() => {
        renderTradingView();
    }, 2000);
}

/**
 * Update trader reputation based on trade fairness
 * @param {Object} trader - The trader object
 * @param {Array} playerCards - Cards offered by player
 * @param {Array} traderCards - Cards offered by trader
 * @param {number} playerCash - Cash offered by player
 * @param {number} traderCash - Cash offered by trader
 */
function updateTraderReputation(trader, playerCards, traderCards, playerCash, traderCash) {
    // Calculate total value of what player gave
    let playerGaveValue = playerCash;
    playerCards.forEach(card => {
        const cardInfo = TCG_CARDS[card.id];
        playerGaveValue += calculateCardValue(cardInfo, card.instance);
    });
    
    // Calculate total value of what trader gave
    let traderGaveValue = traderCash;
    traderCards.forEach(card => {
        const cardInfo = TCG_CARDS[card.id];
        traderGaveValue += calculateCardValue(cardInfo, card.instance);
    });
    
    // Calculate fairness ratio
    const fairnessRatio = playerGaveValue / traderGaveValue;
    
    // Update reputation based on fairness
    if (fairnessRatio > 1.2) {
        // Player gave significantly more than received
        trader.reputation = Math.min(100, trader.reputation + 5);
    } else if (fairnessRatio < 0.8) {
        // Player gave significantly less than received
        trader.reputation = Math.max(0, trader.reputation - 5);
    }
}

/**
 * Render the trade history view
 */
function renderTradeHistoryView() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = '';
    
    // Create trade history container
    const tradeHistoryView = document.createElement('div');
    tradeHistoryView.className = 'trade-history-view';
    
    tradeHistoryView.innerHTML = `
        <h2 class="section-title">Trade History</h2>
        <div class="trade-history-list" id="trade-history-list"></div>
        <button id="back-to-trading" class="back-button">Back to Trading</button>
    `;
    
    mainView.appendChild(tradeHistoryView);
    
    // Add event listener to back button
    document.getElementById('back-to-trading').addEventListener('click', renderTradingView);
    
    // Render trade history
    renderTradeHistoryList();
}

/**
 * Render the trade history list
 */
function renderTradeHistoryList() {
    const tradeHistoryList = document.getElementById('trade-history-list');
    if (!tradeHistoryList) return;
    
    if (gameState.trading.tradeHistory.length === 0) {
        tradeHistoryList.innerHTML = '<div class="no-trades">No trades have been made yet.</div>';
        return;
    }
    
    tradeHistoryList.innerHTML = '';
    
    // Sort trades by date (most recent first)
    const sortedTrades = [...gameState.trading.tradeHistory].sort((a, b) => {
        if (a.date.year !== b.date.year) return b.date.year - a.date.year;
        return b.date.day - a.date.day;
    });
    
    sortedTrades.forEach(trade => {
        const tradeItem = document.createElement('div');
        tradeItem.className = 'trade-history-item';
        
        // Calculate total values
        let playerGaveCardsValue = 0;
        let playerReceivedCardsValue = 0;
        
        tradeItem.innerHTML = `
            <div class="trade-date">Year ${trade.date.year}, Day ${trade.date.day}</div>
            <div class="trade-partner">Traded with: ${trade.trader}</div>
            <div class="trade-details">
                <div class="trade-gave">
                    <h4>You Gave:</h4>
                    <div class="trade-cash">Cash: $${trade.playerGave.cash.toFixed(2)}</div>
                    <div class="trade-cards">
                        Cards: ${trade.playerGave.cards.length > 0 ? 
                            trade.playerGave.cards.map(c => c.name).join(', ') : 
                            'None'}
                    </div>
                </div>
                <div class="trade-received">
                    <h4>You Received:</h4>
                    <div class="trade-cash">Cash: $${trade.playerReceived.cash.toFixed(2)}</div>
                    <div class="trade-cards">
                        Cards: ${trade.playerReceived.cards.length > 0 ? 
                            trade.playerReceived.cards.map(c => c.name).join(', ') : 
                            'None'}
                    </div>
                </div>
            </div>
        `;
        
        tradeHistoryList.appendChild(tradeItem);
    });
}

// Export functions for use in main game
window.tradingSystem = {
    initializeTradingSystem,
    renderTradingView,
    renderTradeHistoryView
};