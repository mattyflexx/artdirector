// main_enhanced.js - Enhanced version of the Cardboard Capitalist game

// Game state
let gameState = {
    player: {
        cash: 50.00,
        netWorth: 50.00,
        collection: {},
        sealedInventory: { genesis: 0 },
        supplies: { sleeves: 100, toploaders: 50 }
    },
    date: { year: 1, day: 1 },
    ui: { 
        currentView: 'collection',
        selectedCard: null,
        selectedPack: null,
        filters: {
            rarity: [],
            condition: [],
            protection: []
        },
        sort: {
            by: 'doodledexNum',
            order: 'asc'
        }
    },
    market: { 
        events: [],
        trends: [],
        priceModifiers: {}
    },
    stats: {
        packsOpened: 0,
        cardsAcquired: 0,
        cardsSold: 0,
        totalEarned: 0,
        totalSpent: 0,
        daysPlayed: 0,
        highestValueCard: { name: "None", value: 0 },
        marketEvents: 0,
        achievementsUnlocked: 0
    }
};

// DOM Elements
const DOM = {
    mainView: document.getElementById('main-view'),
    viewTitle: document.getElementById('view-title'),
    playerCash: document.getElementById('player-cash'),
    playerNetWorth: document.getElementById('player-net-worth'),
    playerSleeves: document.getElementById('player-sleeves'),
    playerToploaders: document.getElementById('player-toploaders'),
    gameDate: document.getElementById('game-date'),
    logFeed: document.getElementById('log-feed'),
    navContainer: document.getElementById('main-nav'),
    nextDayBtn: document.getElementById('next-day-btn'),
    filterBtn: document.getElementById('filter-btn'),
    sortBtn: document.getElementById('sort-btn')
};

// Asset paths are defined in config.js

// Card conditions
const CARD_CONDITIONS = {
    MINT: { name: "Mint", value: 1.0, chance: 0.2 },
    NEAR_MINT: { name: "Near Mint", value: 0.9, chance: 0.5 },
    EXCELLENT: { name: "Excellent", value: 0.7, chance: 0.2 },
    GOOD: { name: "Good", value: 0.5, chance: 0.08 },
    POOR: { name: "Poor", value: 0.3, chance: 0.02 }
};

// Market event types
const MARKET_EVENTS = {
    PRICE_SPIKE: { name: "Price Spike", description: "A sudden increase in demand has caused prices to rise!", duration: 3 },
    PRICE_DROP: { name: "Market Crash", description: "Oversupply has caused prices to plummet!", duration: 3 },
    RARITY_DEMAND: { name: "Rarity Demand", description: "Collectors are seeking specific rarities!", duration: 5 },
    SET_POPULARITY: { name: "Set Popularity", description: "A particular set has become very popular!", duration: 7 },
    CARD_SPOTLIGHT: { name: "Card Spotlight", description: "A specific card is getting a lot of attention!", duration: 4 }
};

// Achievement definitions
const ACHIEVEMENTS = {
    FIRST_PACK: { id: "first_pack", name: "Pack Collector", description: "Open your first pack", unlocked: false },
    COLLECTION_10: { id: "collection_10", name: "Budding Collector", description: "Collect 10 unique cards", unlocked: false },
    COLLECTION_50: { id: "collection_50", name: "Serious Collector", description: "Collect 50 unique cards", unlocked: false },
    COLLECTION_100: { id: "collection_100", name: "Master Collector", description: "Collect 100 unique cards", unlocked: false },
    RICH_100: { id: "rich_100", name: "Card Entrepreneur", description: "Reach $100 in net worth", unlocked: false },
    RICH_500: { id: "rich_500", name: "Card Mogul", description: "Reach $500 in net worth", unlocked: false },
    RICH_1000: { id: "rich_1000", name: "Card Tycoon", description: "Reach $1,000 in net worth", unlocked: false },
    FULL_SET: { id: "full_set", name: "Completionist", description: "Complete a full set", unlocked: false },
    PROTECTED_50: { id: "protected_50", name: "Card Guardian", description: "Protect 50 cards with sleeves or toploaders", unlocked: false },
    YEAR_5: { id: "year_5", name: "Dedicated Collector", description: "Reach Year 5", unlocked: false }
};

// Initialize the game
function initializeGame() {
    console.log("Game is initializing...");
    
    // Generate image paths for all standard cards
    TCG_SETS.genesis.cards.forEach(card => {
        if (!card.img) {
            const paddedDexNum = String(card.doodledexNum).padStart(3, '0');
            const formattedName = card.name.toLowerCase().replace(/\s+/g, '-');
            card.img = `${ASSET_PATH}${paddedDexNum}-${formattedName}.png`;
        }
    });
    
    // Try to load saved game
    const gameLoaded = loadGame();
    
    if (!gameLoaded) {
        // Add starter cards
        addCardToCollection(TCG_SETS.genesis.cards.find(c => c.id === 'GS032'));
        addCardToCollection(TCG_SETS.genesis.cards.find(c => c.id === 'GS001'));
        addCardToCollection(TCG_SETS.genesis.cards.find(c => c.id === 'GS004'));
        
        logMessage("Welcome to Cardboard Capitalist! Your trading card journey begins now.", "system");
    }
    
    setupNavigation();
    setupEventListeners();
    renderMainView('collection');
    updateUI();
}

// Setup navigation
function setupNavigation() {
    console.log("Setting up navigation...");
    
    const navItems = [
        { id: 'collection', label: 'Collection', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { id: 'store', label: 'Store', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { id: 'market', label: 'Market', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { id: 'stats', label: 'Stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
    ];
    
    if (!DOM.navContainer) {
        console.error("Navigation container not found!");
        return;
    }
    
    DOM.navContainer.innerHTML = '';
    
    navItems.forEach(item => {
        const navButton = document.createElement('button');
        navButton.className = `nav-btn ${gameState.ui.currentView === item.id ? 'active' : ''}`;
        navButton.dataset.view = item.id;
        
        navButton.innerHTML = `
        <span class="sr-only">${item.label}</span>
        <svg class="h-6 w-6 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${item.icon}"></path>
        </svg>
        ${item.label}
        `;
        
        // Add event listener
        navButton.addEventListener('click', () => {
            console.log(`Navigation button clicked: ${item.id}`);
            renderMainView(item.id);
        });
        
        DOM.navContainer.appendChild(navButton);
    });
}

// Setup event listeners
function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Next day button
    DOM.nextDayBtn.addEventListener('click', function() {
        console.log("Next day button clicked");
        advanceDay();
    });
    
    // Filter button
    DOM.filterBtn.addEventListener('click', function() {
        console.log("Filter button clicked");
        showFilterModal();
    });
    
    // Sort button
    DOM.sortBtn.addEventListener('click', function() {
        console.log("Sort button clicked");
        showSortModal();
    });
}

// Render main view
function renderMainView(viewName) {
    console.log(`Rendering view: ${viewName}`);
    
    if (!DOM.mainView) {
        console.error("Main view container not found!");
        return;
    }
    
    // Clear the main view
    DOM.mainView.innerHTML = '';
    
    // Update the current view in game state
    gameState.ui.currentView = viewName;
    
    // Update navigation buttons to highlight the current view
    document.querySelectorAll('[data-view]').forEach(button => {
        if (button.dataset.view === viewName) {
            button.classList.add('active');
            button.classList.remove('text-gray-400', 'hover:bg-gray-700', 'hover:text-white');
        } else {
            button.classList.remove('active');
            button.classList.add('text-gray-400', 'hover:bg-gray-700', 'hover:text-white');
        }
    });
    
    // Render the appropriate view based on the view name
    switch(viewName) {
        case 'collection':
            DOM.viewTitle.textContent = 'Collection';
            renderCollectionView(DOM.mainView);
            break;
        case 'store':
            DOM.viewTitle.textContent = 'Store';
            renderStoreView(DOM.mainView);
            break;
        case 'market':
            DOM.viewTitle.textContent = 'Market';
            renderMarketView(DOM.mainView);
            break;
        case 'stats':
            DOM.viewTitle.textContent = 'Statistics';
            renderStatsView(DOM.mainView);
            break;
        default:
            DOM.viewTitle.textContent = 'Collection';
            renderCollectionView(DOM.mainView);
            break;
    }
}

// Render collection view
function renderCollectionView(container) {
    const collectionDiv = document.createElement('div');
    collectionDiv.className = 'space-y-6';
    
    // Collection stats
    const statsDiv = document.createElement('div');
    statsDiv.className = 'collection-stats';
    
    const totalCards = Object.values(gameState.player.collection).reduce((sum, card) => sum + card.instances.length, 0);
    const uniqueCards = Object.keys(gameState.player.collection).length;
    const collectionValue = calculateCollectionValue();
    
    // Total cards stat
    const totalCardsDiv = document.createElement('div');
    totalCardsDiv.className = 'stat-card';
    totalCardsDiv.innerHTML = `
        <span class="stat-card-label">Total Cards</span>
        <span class="stat-card-value">${totalCards}</span>
    `;
    statsDiv.appendChild(totalCardsDiv);
    
    // Unique cards stat
    const uniqueCardsDiv = document.createElement('div');
    uniqueCardsDiv.className = 'stat-card';
    uniqueCardsDiv.innerHTML = `
        <span class="stat-card-label">Unique Cards</span>
        <span class="stat-card-value">${uniqueCards}</span>
    `;
    statsDiv.appendChild(uniqueCardsDiv);
    
    // Collection value stat
    const valueDiv = document.createElement('div');
    valueDiv.className = 'stat-card';
    valueDiv.innerHTML = `
        <span class="stat-card-label">Collection Value</span>
        <span class="stat-card-value value">$${collectionValue.toFixed(2)}</span>
    `;
    statsDiv.appendChild(valueDiv);
    
    // Protected cards stat
    const protectedCards = countProtectedCards();
    const protectedDiv = document.createElement('div');
    protectedDiv.className = 'stat-card';
    protectedDiv.innerHTML = `
        <span class="stat-card-label">Protected Cards</span>
        <span class="stat-card-value">${protectedCards}</span>
    `;
    statsDiv.appendChild(protectedDiv);
    
    collectionDiv.appendChild(statsDiv);
    
    // Collection grid
    const grid = document.createElement('div');
    grid.className = 'collection-grid';
    grid.id = 'collection-grid';
    
    if (Object.keys(gameState.player.collection).length === 0) {
        grid.innerHTML = `<p class="col-span-full text-gray-400">Your collection is empty. Visit the store to buy some packs!</p>`;
    } else {
        renderFilteredCollection(grid);
    }
    
    collectionDiv.appendChild(grid);
    container.appendChild(collectionDiv);
}

// Render filtered collection
function renderFilteredCollection(grid) {
    grid.innerHTML = '';
    
    let allInstances = [];
    Object.values(gameState.player.collection).forEach(cardData => {
        cardData.instances.forEach(instance => {
            allInstances.push({ cardInfo: cardData.cardInfo, instance });
        });
    });
    
    // Apply filters
    if (gameState.ui.filters.rarity.length > 0) {
        allInstances = allInstances.filter(item => 
            gameState.ui.filters.rarity.includes(item.cardInfo.rarity)
        );
    }
    
    if (gameState.ui.filters.condition.length > 0) {
        allInstances = allInstances.filter(item => 
            gameState.ui.filters.condition.includes(item.instance.condition)
        );
    }
    
    if (gameState.ui.filters.protection.length > 0) {
        allInstances = allInstances.filter(item => {
            if (gameState.ui.filters.protection.includes('sleeved') && item.instance.sleeved) return true;
            if (gameState.ui.filters.protection.includes('toploadered') && item.instance.toploadered) return true;
            if (gameState.ui.filters.protection.includes('unprotected') && !item.instance.sleeved && !item.instance.toploadered) return true;
            return false;
        });
    }
    
    // Apply sorting
    allInstances.sort((a, b) => {
        let valueA, valueB;
        
        switch (gameState.ui.sort.by) {
            case 'doodledexNum':
                valueA = a.cardInfo.doodledexNum;
                valueB = b.cardInfo.doodledexNum;
                break;
            case 'name':
                valueA = a.cardInfo.name;
                valueB = b.cardInfo.name;
                break;
            case 'rarity':
                const rarityOrder = { 'Common': 0, 'Uncommon': 1, 'Holo Rare': 2, 'Alternate Art': 3, 'Chase': 4 };
                valueA = rarityOrder[a.cardInfo.rarity] || 0;
                valueB = rarityOrder[b.cardInfo.rarity] || 0;
                break;
            case 'value':
                valueA = getCardValue(a.cardInfo, a.instance);
                valueB = getCardValue(b.cardInfo, b.instance);
                break;
            case 'condition':
                const conditionOrder = { 'Mint': 0, 'Near Mint': 1, 'Excellent': 2, 'Good': 3, 'Poor': 4 };
                valueA = conditionOrder[a.instance.condition] || 0;
                valueB = conditionOrder[b.instance.condition] || 0;
                break;
            case 'acquired':
                valueA = a.instance.acquired.year * 30 + a.instance.acquired.day;
                valueB = b.instance.acquired.year * 30 + b.instance.acquired.day;
                break;
            default:
                valueA = a.cardInfo.doodledexNum;
                valueB = b.cardInfo.doodledexNum;
        }
        
        // Apply sort order
        const sortOrder = gameState.ui.sort.order === 'asc' ? 1 : -1;
        
        if (valueA < valueB) return -1 * sortOrder;
        if (valueA > valueB) return 1 * sortOrder;
        return 0;
    });
    
    if (allInstances.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-gray-400">No cards match your filter criteria.</p>`;
        return;
    }
    
    allInstances.forEach(item => {
        const cardElement = buildCardElement(item.cardInfo, item.instance);
        grid.appendChild(cardElement);
    });
}

// Render store view
function renderStoreView(container) {
    const storeDiv = document.createElement('div');
    storeDiv.className = 'space-y-6';
    
    // Pack section
    const packSection = document.createElement('div');
    packSection.className = 'store-section';
    
    const packHeader = document.createElement('h3');
    packHeader.className = 'store-section-title';
    packHeader.textContent = 'Card Packs';
    packSection.appendChild(packHeader);
    
    const packGrid = document.createElement('div');
    packGrid.className = 'store-grid';
    
    // Genesis pack
    const genesisPack = document.createElement('div');
    genesisPack.className = 'store-item';
    
    const packImg = document.createElement('img');
    packImg.src = TCG_SETS.genesis.pack.img;
    packImg.alt = 'Genesis Pack';
    packImg.className = 'store-item-image';
    genesisPack.appendChild(packImg);
    
    const packName = document.createElement('h4');
    packName.className = 'store-item-title';
    packName.textContent = 'Genesis Pack';
    genesisPack.appendChild(packName);
    
    const packPrice = document.createElement('p');
    packPrice.className = 'store-item-price';
    packPrice.textContent = `$${TCG_SETS.genesis.pack.price.toFixed(2)}`;
    genesisPack.appendChild(packPrice);
    
    const packDesc = document.createElement('p');
    packDesc.className = 'store-item-description';
    packDesc.textContent = '11 cards per pack. Chance for Holo Rare, Alternate Art, and Chase cards!';
    genesisPack.appendChild(packDesc);
    
    const buyButton = document.createElement('button');
    buyButton.className = 'btn btn-primary btn-block';
    buyButton.textContent = 'Buy Pack';
    buyButton.dataset.packType = 'genesis';
    buyButton.addEventListener('click', () => buyPack('genesis'));
    genesisPack.appendChild(buyButton);
    
    packGrid.appendChild(genesisPack);
    packSection.appendChild(packGrid);
    storeDiv.appendChild(packSection);
    
    // Supplies section
    const suppliesSection = document.createElement('div');
    suppliesSection.className = 'store-section';
    
    const suppliesHeader = document.createElement('h3');
    suppliesHeader.className = 'store-section-title';
    suppliesHeader.textContent = 'Supplies';
    suppliesSection.appendChild(suppliesHeader);
    
    const suppliesGrid = document.createElement('div');
    suppliesGrid.className = 'store-grid';
    
    // Sleeves
    const sleevesItem = document.createElement('div');
    sleevesItem.className = 'store-item';
    
    const sleevesName = document.createElement('h4');
    sleevesName.className = 'store-item-title';
    sleevesName.textContent = 'Card Sleeves (10 pack)';
    sleevesItem.appendChild(sleevesName);
    
    const sleevesPrice = document.createElement('p');
    sleevesPrice.className = 'store-item-price';
    sleevesPrice.textContent = '$2.00';
    sleevesItem.appendChild(sleevesPrice);
    
    const sleevesDesc = document.createElement('p');
    sleevesDesc.className = 'store-item-description';
    sleevesDesc.textContent = 'Protect your cards from scratches and minor damage.';
    sleevesItem.appendChild(sleevesDesc);
    
    const buySleevesButton = document.createElement('button');
    buySleevesButton.className = 'btn btn-primary btn-block';
    buySleevesButton.textContent = 'Buy Sleeves';
    buySleevesButton.addEventListener('click', () => buySupplies('sleeves', 10, 2.00));
    sleevesItem.appendChild(buySleevesButton);
    
    suppliesGrid.appendChild(sleevesItem);
    
    // Toploaders
    const toploadersItem = document.createElement('div');
    toploadersItem.className = 'store-item';
    
    const toploadersName = document.createElement('h4');
    toploadersName.className = 'store-item-title';
    toploadersName.textContent = 'Toploaders (5 pack)';
    toploadersItem.appendChild(toploadersName);
    
    const toploadersPrice = document.createElement('p');
    toploadersPrice.className = 'store-item-price';
    toploadersPrice.textContent = '$5.00';
    toploadersItem.appendChild(toploadersPrice);
    
    const toploadersDesc = document.createElement('p');
    toploadersDesc.className = 'store-item-description';
    toploadersDesc.textContent = 'Hard plastic protection for your most valuable cards.';
    toploadersItem.appendChild(toploadersDesc);
    
    const buyToploadersButton = document.createElement('button');
    buyToploadersButton.className = 'btn btn-primary btn-block';
    buyToploadersButton.textContent = 'Buy Toploaders';
    buyToploadersButton.addEventListener('click', () => buySupplies('toploaders', 5, 5.00));
    toploadersItem.appendChild(buyToploadersButton);
    
    suppliesGrid.appendChild(toploadersItem);
    
    // Card Binder
    const binderItem = document.createElement('div');
    binderItem.className = 'store-item';
    
    const binderName = document.createElement('h4');
    binderName.className = 'store-item-title';
    binderName.textContent = 'Card Binder';
    binderItem.appendChild(binderName);
    
    const binderPrice = document.createElement('p');
    binderPrice.className = 'store-item-price';
    binderPrice.textContent = '$15.00';
    binderItem.appendChild(binderPrice);
    
    const binderDesc = document.createElement('p');
    binderDesc.className = 'store-item-description';
    binderDesc.textContent = 'Store and display your collection in this premium binder.';
    binderItem.appendChild(binderDesc);
    
    const buyBinderButton = document.createElement('button');
    buyBinderButton.className = 'btn btn-primary btn-block';
    buyBinderButton.textContent = 'Buy Binder';
    buyBinderButton.addEventListener('click', () => buySupplies('binder', 1, 15.00));
    binderItem.appendChild(buyBinderButton);
    
    suppliesGrid.appendChild(binderItem);
    
    suppliesSection.appendChild(suppliesGrid);
    storeDiv.appendChild(suppliesSection);
    
    // Sealed inventory section (if player has any sealed packs)
    const hasSealedInventory = Object.values(gameState.player.sealedInventory).some(count => count > 0);
    
    if (hasSealedInventory) {
        const sealedSection = document.createElement('div');
        sealedSection.className = 'store-section';
        
        const sealedHeader = document.createElement('h3');
        sealedHeader.className = 'store-section-title';
        sealedHeader.textContent = 'Your Sealed Inventory';
        sealedSection.appendChild(sealedHeader);
        
        const sealedGrid = document.createElement('div');
        sealedGrid.className = 'store-grid';
        
        // Add each sealed pack type
        for (const [packType, count] of Object.entries(gameState.player.sealedInventory)) {
            if (count > 0 && TCG_SETS[packType]) {
                const packItem = document.createElement('div');
                packItem.className = 'store-item';
                
                const packImg = document.createElement('img');
                packImg.src = TCG_SETS[packType].pack.img;
                packImg.alt = `${TCG_SETS[packType].name} Pack`;
                packImg.className = 'store-item-image';
                packItem.appendChild(packImg);
                
                const packName = document.createElement('h4');
                packName.className = 'store-item-title';
                packName.textContent = `${TCG_SETS[packType].name} Pack`;
                packItem.appendChild(packName);
                
                const packCount = document.createElement('p');
                packCount.className = 'store-item-description';
                packCount.textContent = `You have ${count} pack${count !== 1 ? 's' : ''}`;
                packItem.appendChild(packCount);
                
                const openButton = document.createElement('button');
                openButton.className = 'btn btn-success btn-block';
                openButton.textContent = 'Open Pack';
                openButton.dataset.packType = packType;
                openButton.addEventListener('click', () => openPack(packType));
                packItem.appendChild(openButton);
                
                sealedGrid.appendChild(packItem);
            }
        }
        
        sealedSection.appendChild(sealedGrid);
        storeDiv.appendChild(sealedSection);
    }
    
    container.appendChild(storeDiv);
}

// Render market view
function renderMarketView(container) {
    const marketDiv = document.createElement('div');
    marketDiv.className = 'space-y-6';
    
    // Market trends section
    const trendsSection = document.createElement('div');
    trendsSection.className = 'store-section';
    
    const trendsHeader = document.createElement('h3');
    trendsHeader.className = 'store-section-title';
    trendsHeader.textContent = 'Market Trends';
    trendsSection.appendChild(trendsHeader);
    
    // Market events
    if (gameState.market.events.length > 0) {
        const eventsDiv = document.createElement('div');
        eventsDiv.className = 'bg-gray-800 p-4 rounded-lg mb-4';
        
        const eventsTitle = document.createElement('h4');
        eventsTitle.className = 'text-lg font-bold mb-2';
        eventsTitle.textContent = 'Current Market Events';
        eventsDiv.appendChild(eventsTitle);
        
        gameState.market.events.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'bg-gray-700 p-3 rounded-lg mb-2';
            
            const eventName = document.createElement('div');
            eventName.className = 'font-bold';
            eventName.textContent = event.name;
            eventItem.appendChild(eventName);
            
            const eventDesc = document.createElement('div');
            eventDesc.className = 'text-sm text-gray-300';
            eventDesc.textContent = event.description;
            eventItem.appendChild(eventDesc);
            
            const eventDuration = document.createElement('div');
            eventDuration.className = 'text-xs text-gray-400 mt-1';
            eventDuration.textContent = `${event.daysRemaining} day${event.daysRemaining !== 1 ? 's' : ''} remaining`;
            eventItem.appendChild(eventDuration);
            
            eventsDiv.appendChild(eventItem);
        });
        
        trendsSection.appendChild(eventsDiv);
    } else {
        const noEventsDiv = document.createElement('div');
        noEventsDiv.className = 'bg-gray-800 p-4 rounded-lg mb-4 text-center';
        noEventsDiv.textContent = 'No active market events. Check back tomorrow!';
        trendsSection.appendChild(noEventsDiv);
    }
    
    marketDiv.appendChild(trendsSection);
    
    // Card values section
    const valuesSection = document.createElement('div');
    valuesSection.className = 'store-section';
    
    const valuesHeader = document.createElement('h3');
    valuesHeader.className = 'store-section-title';
    valuesHeader.textContent = 'Card Values';
    valuesSection.appendChild(valuesHeader);
    
    // Top valued cards
    const topCards = getTopValuedCards(5);
    
    if (topCards.length > 0) {
        const topCardsDiv = document.createElement('div');
        topCardsDiv.className = 'bg-gray-800 p-4 rounded-lg';
        
        const topCardsTitle = document.createElement('h4');
        topCardsTitle.className = 'text-lg font-bold mb-2';
        topCardsTitle.textContent = 'Your Most Valuable Cards';
        topCardsDiv.appendChild(topCardsTitle);
        
        const cardsTable = document.createElement('table');
        cardsTable.className = 'w-full';
        
        // Table header
        const tableHeader = document.createElement('thead');
        tableHeader.innerHTML = `
            <tr class="text-left border-b border-gray-700">
                <th class="py-2">Card</th>
                <th class="py-2">Rarity</th>
                <th class="py-2">Condition</th>
                <th class="py-2">Value</th>
            </tr>
        `;
        cardsTable.appendChild(tableHeader);
        
        // Table body
        const tableBody = document.createElement('tbody');
        
        topCards.forEach(card => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-700';
            
            row.innerHTML = `
                <td class="py-2">${card.cardInfo.name}</td>
                <td class="py-2">${card.cardInfo.rarity}</td>
                <td class="py-2">${card.instance.condition}</td>
                <td class="py-2 text-green-400">$${card.value.toFixed(2)}</td>
            `;
            
            tableBody.appendChild(row);
        });
        
        cardsTable.appendChild(tableBody);
        topCardsDiv.appendChild(cardsTable);
        
        valuesSection.appendChild(topCardsDiv);
    } else {
        const noCardsDiv = document.createElement('div');
        noCardsDiv.className = 'bg-gray-800 p-4 rounded-lg text-center';
        noCardsDiv.textContent = 'You don\'t have any cards in your collection yet.';
        valuesSection.appendChild(noCardsDiv);
    }
    
    marketDiv.appendChild(valuesSection);
    
    // Trading section (placeholder for future feature)
    const tradingSection = document.createElement('div');
    tradingSection.className = 'store-section';
    
    const tradingHeader = document.createElement('h3');
    tradingHeader.className = 'store-section-title';
    tradingHeader.textContent = 'Trading (Coming Soon)';
    tradingSection.appendChild(tradingHeader);
    
    const tradingPlaceholder = document.createElement('div');
    tradingPlaceholder.className = 'bg-gray-800 p-4 rounded-lg text-center';
    tradingPlaceholder.textContent = 'Trading feature is coming soon! Check back later.';
    tradingSection.appendChild(tradingPlaceholder);
    
    marketDiv.appendChild(tradingSection);
    
    container.appendChild(marketDiv);
}

// Render stats view
function renderStatsView(container) {
    const statsDiv = document.createElement('div');
    statsDiv.className = 'space-y-6';
    
    // Game stats section
    const gameStatsSection = document.createElement('div');
    gameStatsSection.className = 'store-section';
    
    const gameStatsHeader = document.createElement('h3');
    gameStatsHeader.className = 'store-section-title';
    gameStatsHeader.textContent = 'Game Statistics';
    gameStatsSection.appendChild(gameStatsHeader);
    
    const statsGrid = document.createElement('div');
    statsGrid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4';
    
    // Days played
    const daysPlayedDiv = document.createElement('div');
    daysPlayedDiv.className = 'bg-gray-800 p-4 rounded-lg';
    daysPlayedDiv.innerHTML = `
        <div class="text-sm text-gray-400">Days Played</div>
        <div class="text-2xl font-bold">${gameState.stats.daysPlayed}</div>
    `;
    statsGrid.appendChild(daysPlayedDiv);
    
    // Packs opened
    const packsOpenedDiv = document.createElement('div');
    packsOpenedDiv.className = 'bg-gray-800 p-4 rounded-lg';
    packsOpenedDiv.innerHTML = `
        <div class="text-sm text-gray-400">Packs Opened</div>
        <div class="text-2xl font-bold">${gameState.stats.packsOpened}</div>
    `;
    statsGrid.appendChild(packsOpenedDiv);
    
    // Cards acquired
    const cardsAcquiredDiv = document.createElement('div');
    cardsAcquiredDiv.className = 'bg-gray-800 p-4 rounded-lg';
    cardsAcquiredDiv.innerHTML = `
        <div class="text-sm text-gray-400">Cards Acquired</div>
        <div class="text-2xl font-bold">${gameState.stats.cardsAcquired}</div>
    `;
    statsGrid.appendChild(cardsAcquiredDiv);
    
    // Cards sold
    const cardsSoldDiv = document.createElement('div');
    cardsSoldDiv.className = 'bg-gray-800 p-4 rounded-lg';
    cardsSoldDiv.innerHTML = `
        <div class="text-sm text-gray-400">Cards Sold</div>
        <div class="text-2xl font-bold">${gameState.stats.cardsSold}</div>
    `;
    statsGrid.appendChild(cardsSoldDiv);
    
    // Total earned
    const totalEarnedDiv = document.createElement('div');
    totalEarnedDiv.className = 'bg-gray-800 p-4 rounded-lg';
    totalEarnedDiv.innerHTML = `
        <div class="text-sm text-gray-400">Total Earned</div>
        <div class="text-2xl font-bold text-green-400">$${gameState.stats.totalEarned.toFixed(2)}</div>
    `;
    statsGrid.appendChild(totalEarnedDiv);
    
    // Total spent
    const totalSpentDiv = document.createElement('div');
    totalSpentDiv.className = 'bg-gray-800 p-4 rounded-lg';
    totalSpentDiv.innerHTML = `
        <div class="text-sm text-gray-400">Total Spent</div>
        <div class="text-2xl font-bold text-red-400">$${gameState.stats.totalSpent.toFixed(2)}</div>
    `;
    statsGrid.appendChild(totalSpentDiv);
    
    // Net profit
    const netProfit = gameState.stats.totalEarned - gameState.stats.totalSpent;
    const netProfitDiv = document.createElement('div');
    netProfitDiv.className = 'bg-gray-800 p-4 rounded-lg';
    netProfitDiv.innerHTML = `
        <div class="text-sm text-gray-400">Net Profit</div>
        <div class="text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}">$${netProfit.toFixed(2)}</div>
    `;
    statsGrid.appendChild(netProfitDiv);
    
    // Collection value
    const collectionValue = calculateCollectionValue();
    const collectionValueDiv = document.createElement('div');
    collectionValueDiv.className = 'bg-gray-800 p-4 rounded-lg';
    collectionValueDiv.innerHTML = `
        <div class="text-sm text-gray-400">Collection Value</div>
        <div class="text-2xl font-bold text-blue-400">$${collectionValue.toFixed(2)}</div>
    `;
    statsGrid.appendChild(collectionValueDiv);
    
    gameStatsSection.appendChild(statsGrid);
    statsDiv.appendChild(gameStatsSection);
    
    // Achievements section
    const achievementsSection = document.createElement('div');
    achievementsSection.className = 'store-section';
    
    const achievementsHeader = document.createElement('h3');
    achievementsHeader.className = 'store-section-title';
    achievementsHeader.textContent = 'Achievements';
    achievementsSection.appendChild(achievementsHeader);
    
    const achievementsGrid = document.createElement('div');
    achievementsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
    
    // Add each achievement
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        const achievementItem = document.createElement('div');
        achievementItem.className = `bg-gray-800 p-4 rounded-lg ${achievement.unlocked ? 'border-2 border-yellow-400' : 'opacity-70'}`;
        
        const achievementHeader = document.createElement('div');
        achievementHeader.className = 'flex items-center gap-2 mb-2';
        
        const achievementIcon = document.createElement('div');
        achievementIcon.className = `w-8 h-8 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-yellow-400 text-gray-900' : 'bg-gray-600'}`;
        achievementIcon.innerHTML = achievement.unlocked ? '✓' : '?';
        achievementHeader.appendChild(achievementIcon);
        
        const achievementName = document.createElement('div');
        achievementName.className = 'font-bold';
        achievementName.textContent = achievement.name;
        achievementHeader.appendChild(achievementName);
        
        achievementItem.appendChild(achievementHeader);
        
        const achievementDesc = document.createElement('div');
        achievementDesc.className = 'text-sm text-gray-300';
        achievementDesc.textContent = achievement.description;
        achievementItem.appendChild(achievementDesc);
        
        achievementsGrid.appendChild(achievementItem);
    }
    
    achievementsSection.appendChild(achievementsGrid);
    statsDiv.appendChild(achievementsSection);
    
    container.appendChild(statsDiv);
}

// Add card to collection
function addCardToCollection(cardInfo) {
    if (!cardInfo) return;
    
    // Create a new instance of the card
    const cardInstance = {
        uid: generateUid(),
        condition: determineCardCondition(),
        sleeved: false,
        toploadered: false,
        acquired: { ...gameState.date },
        graded: null
    };
    
    // Add to collection
    if (!gameState.player.collection[cardInfo.id]) {
        gameState.player.collection[cardInfo.id] = {
            cardInfo: cardInfo,
            instances: []
        };
    }
    
    gameState.player.collection[cardInfo.id].instances.push(cardInstance);
    
    // Update stats
    gameState.stats.cardsAcquired++;
    
    // Check for achievements
    checkAchievements();
    
    // Log message
    logMessage(`Added ${cardInfo.name} (${cardInfo.rarity}) to your collection!`, "card");
    
    // Save game
    saveGame();
    
    return cardInstance;
}

// Buy a pack
function buyPack(packType) {
    const pack = TCG_SETS[packType].pack;
    
    if (gameState.player.cash < pack.price) {
        logMessage("Not enough cash to buy this pack.", "error");
        return false;
    }
    
    // Deduct cash
    gameState.player.cash -= pack.price;
    gameState.stats.totalSpent += pack.price;
    
    // Add to sealed inventory
    gameState.player.sealedInventory[packType] = (gameState.player.sealedInventory[packType] || 0) + 1;
    
    // Log message
    logMessage(`Purchased a ${TCG_SETS[packType].name} pack for $${pack.price.toFixed(2)}!`, "system");
    
    // Update UI
    updateUI();
    
    // Save game
    saveGame();
    
    // Offer to open the pack
    const packDiv = document.createElement('div');
    packDiv.className = 'bg-green-800 p-4 rounded-lg mb-4';
    packDiv.innerHTML = `
        <h3 class="text-lg font-bold mb-2">Pack Added to Inventory!</h3>
        <p class="mb-4">You now have ${gameState.player.sealedInventory[packType]} ${TCG_SETS[packType].name} pack(s).</p>
        <button class="btn btn-success btn-block" data-pack-type="${packType}">Open Pack Now</button>
    `;
    
    // Add event listener to the button
    const openPackBtn = packDiv.querySelector('button');
    openPackBtn.addEventListener('click', () => openPack(packType));
    
    // Insert at the top of the main view
    DOM.mainView.insertBefore(packDiv, DOM.mainView.firstChild);
    
    return true;
}

// Buy supplies
function buySupplies(type, amount, price) {
    if (gameState.player.cash < price) {
        logMessage("Not enough cash to buy these supplies.", "error");
        return false;
    }
    
    // Deduct cash
    gameState.player.cash -= price;
    gameState.stats.totalSpent += price;
    
    // Add supplies
    if (!gameState.player.supplies[type]) {
        gameState.player.supplies[type] = 0;
    }
    
    gameState.player.supplies[type] += amount;
    
    // Log message
    logMessage(`Purchased ${amount} ${type} for $${price.toFixed(2)}!`, "system");
    
    // Update UI
    updateUI();
    
    // Save game
    saveGame();
    
    return true;
}

// Advance day
function advanceDay() {
    console.log("Advancing day...");
    
    // Increment day
    gameState.date.day++;
    
    // Check if we need to advance to the next year
    if (gameState.date.day > 30) {
        gameState.date.day = 1;
        gameState.date.year++;
        logMessage(`Happy New Year! You've reached Year ${gameState.date.year}.`, "system");
        
        // Check for year-based achievements
        if (gameState.date.year >= 5 && !ACHIEVEMENTS.YEAR_5.unlocked) {
            unlockAchievement('YEAR_5');
        }
    }
    
    // Update stats
    gameState.stats.daysPlayed++;
    
    // Process market events
    processMarketEvents();
    
    // Random chance for new market event
    if (Math.random() < 0.2) { // 20% chance each day
        createRandomMarketEvent();
    }
    
    // Update UI
    updateUI();
    
    // Save game
    saveGame();
    
    // Log message
    logMessage(`Advanced to Year ${gameState.date.year}, Day ${gameState.date.day}`, "system");
}

// Process market events
function processMarketEvents() {
    // Update existing events
    gameState.market.events = gameState.market.events.map(event => {
        event.daysRemaining--;
        return event;
    }).filter(event => event.daysRemaining > 0);
}

// Create a random market event
function createRandomMarketEvent() {
    const eventTypes = Object.values(MARKET_EVENTS);
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    // Create the event
    const event = {
        name: randomEvent.name,
        description: randomEvent.description,
        duration: randomEvent.duration,
        daysRemaining: randomEvent.duration,
        type: randomEvent.name.toLowerCase().replace(/\s+/g, '_')
    };
    
    // Add specific details based on event type
    switch (event.type) {
        case 'price_spike':
            event.rarityAffected = ['Holo Rare', 'Alternate Art', 'Chase'][Math.floor(Math.random() * 3)];
            event.multiplier = 1.5;
            event.description = `${event.rarityAffected} cards have increased in value!`;
            break;
        case 'price_drop':
            event.rarityAffected = ['Common', 'Uncommon'][Math.floor(Math.random() * 2)];
            event.multiplier = 0.7;
            event.description = `${event.rarityAffected} cards have decreased in value!`;
            break;
        case 'rarity_demand':
            event.rarityAffected = ['Common', 'Uncommon', 'Holo Rare', 'Alternate Art', 'Chase'][Math.floor(Math.random() * 5)];
            event.multiplier = 1.3;
            event.description = `Collectors are seeking ${event.rarityAffected} cards!`;
            break;
        case 'set_popularity':
            event.setAffected = 'genesis'; // For now, only one set
            event.multiplier = 1.2;
            event.description = `The ${TCG_SETS[event.setAffected].name} set has become very popular!`;
            break;
        case 'card_spotlight':
            const allCards = [];
            for (const setKey in TCG_SETS) {
                allCards.push(...TCG_SETS[setKey].cards);
            }
            const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
            event.cardAffected = randomCard.id;
            event.multiplier = 2.0;
            event.description = `${randomCard.name} is getting a lot of attention!`;
            break;
    }
    
    // Add to market events
    gameState.market.events.push(event);
    
    // Update stats
    gameState.stats.marketEvents++;
    
    // Log message
    logMessage(`Market Event: ${event.name} - ${event.description}`, "market");
}

// Calculate collection value
function calculateCollectionValue() {
    let totalValue = 0;
    
    Object.values(gameState.player.collection).forEach(cardData => {
        cardData.instances.forEach(instance => {
            totalValue += getCardValue(cardData.cardInfo, instance);
        });
    });
    
    return totalValue;
}

// Get card value
function getCardValue(cardInfo, instance) {
    // Base value based on rarity
    const baseValue = getCardBaseValue(cardInfo);
    
    // Condition modifier
    const conditionMultiplier = getConditionMultiplier(instance.condition);
    
    // Protection bonus
    const protectionBonus = (instance.sleeved ? 0.1 : 0) + (instance.toploadered ? 0.15 : 0);
    
    // Market modifiers
    let marketMultiplier = 1.0;
    
    // Apply market event effects
    gameState.market.events.forEach(event => {
        switch (event.type) {
            case 'price_spike':
            case 'price_drop':
            case 'rarity_demand':
                if (cardInfo.rarity === event.rarityAffected) {
                    marketMultiplier *= event.multiplier;
                }
                break;
            case 'set_popularity':
                if (cardInfo.id.startsWith(TCG_SETS[event.setAffected].code)) {
                    marketMultiplier *= event.multiplier;
                }
                break;
            case 'card_spotlight':
                if (cardInfo.id === event.cardAffected) {
                    marketMultiplier *= event.multiplier;
                }
                break;
        }
    });
    
    // Calculate final value
    const totalValue = baseValue * (conditionMultiplier + protectionBonus) * marketMultiplier;
    
    return totalValue;
}

// Get card base value
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

// Get condition multiplier
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

// Determine card condition
function determineCardCondition() {
    const rand = Math.random();
    let cumulativeChance = 0;
    
    for (const condition of Object.values(CARD_CONDITIONS)) {
        cumulativeChance += condition.chance;
        if (rand <= cumulativeChance) {
            return condition.name;
        }
    }
    
    return CARD_CONDITIONS.NEAR_MINT.name;
}

// Count protected cards
function countProtectedCards() {
    let count = 0;
    
    Object.values(gameState.player.collection).forEach(cardData => {
        cardData.instances.forEach(instance => {
            if (instance.sleeved || instance.toploadered) {
                count++;
            }
        });
    });
    
    return count;
}

// Get top valued cards
function getTopValuedCards(limit = 5) {
    const allCards = [];
    
    Object.values(gameState.player.collection).forEach(cardData => {
        cardData.instances.forEach(instance => {
            const value = getCardValue(cardData.cardInfo, instance);
            allCards.push({
                cardInfo: cardData.cardInfo,
                instance,
                value
            });
        });
    });
    
    // Sort by value (descending)
    allCards.sort((a, b) => b.value - a.value);
    
    // Return top N cards
    return allCards.slice(0, limit);
}

// Check for achievements
function checkAchievements() {
    // First pack
    if (gameState.stats.packsOpened === 1 && !ACHIEVEMENTS.FIRST_PACK.unlocked) {
        unlockAchievement('FIRST_PACK');
    }
    
    // Collection size
    const uniqueCards = Object.keys(gameState.player.collection).length;
    if (uniqueCards >= 10 && !ACHIEVEMENTS.COLLECTION_10.unlocked) {
        unlockAchievement('COLLECTION_10');
    }
    if (uniqueCards >= 50 && !ACHIEVEMENTS.COLLECTION_50.unlocked) {
        unlockAchievement('COLLECTION_50');
    }
    if (uniqueCards >= 100 && !ACHIEVEMENTS.COLLECTION_100.unlocked) {
        unlockAchievement('COLLECTION_100');
    }
    
    // Net worth
    const netWorth = gameState.player.cash + calculateCollectionValue();
    if (netWorth >= 100 && !ACHIEVEMENTS.RICH_100.unlocked) {
        unlockAchievement('RICH_100');
    }
    if (netWorth >= 500 && !ACHIEVEMENTS.RICH_500.unlocked) {
        unlockAchievement('RICH_500');
    }
    if (netWorth >= 1000 && !ACHIEVEMENTS.RICH_1000.unlocked) {
        unlockAchievement('RICH_1000');
    }
    
    // Protected cards
    const protectedCards = countProtectedCards();
    if (protectedCards >= 50 && !ACHIEVEMENTS.PROTECTED_50.unlocked) {
        unlockAchievement('PROTECTED_50');
    }
    
    // Check for full set completion
    checkSetCompletion();
}

// Check for set completion
function checkSetCompletion() {
    // For now, just check Genesis set
    const genesisSet = TCG_SETS.genesis;
    const collectedCardIds = Object.keys(gameState.player.collection);
    
    const allSetCardsCollected = genesisSet.cards.every(card => 
        collectedCardIds.includes(card.id)
    );
    
    if (allSetCardsCollected && !ACHIEVEMENTS.FULL_SET.unlocked) {
        unlockAchievement('FULL_SET');
    }
}

// Unlock achievement
function unlockAchievement(achievementKey) {
    if (ACHIEVEMENTS[achievementKey] && !ACHIEVEMENTS[achievementKey].unlocked) {
        ACHIEVEMENTS[achievementKey].unlocked = true;
        ACHIEVEMENTS[achievementKey].unlockedDate = { ...gameState.date };
        
        // Update stats
        gameState.stats.achievementsUnlocked++;
        
        // Log message
        logMessage(`Achievement Unlocked: ${ACHIEVEMENTS[achievementKey].name} - ${ACHIEVEMENTS[achievementKey].description}`, "achievement");
        
        // Show achievement notification
        showAchievementNotification(ACHIEVEMENTS[achievementKey]);
    }
}

// Show achievement notification
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-yellow-800 text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-500 translate-x-full';
    notification.style.maxWidth = '300px';
    
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="bg-yellow-500 text-yellow-900 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                🏆
            </div>
            <div>
                <div class="font-bold">Achievement Unlocked!</div>
                <div>${achievement.name}</div>
                <div class="text-sm text-yellow-300">${achievement.description}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// Show filter modal
function showFilterModal() {
    // Get the template
    const template = document.getElementById('filter-modal-template');
    const clone = document.importNode(template.content, true);
    
    // Add to body
    document.body.appendChild(clone);
    
    // Get the modal
    const modal = document.querySelector('.modal-overlay');
    
    // Set current filters
    const rarityCheckboxes = modal.querySelectorAll('input[type="checkbox"][value]');
    rarityCheckboxes.forEach(checkbox => {
        if (gameState.ui.filters.rarity.includes(checkbox.value) || 
            gameState.ui.filters.condition.includes(checkbox.value) ||
            gameState.ui.filters.protection.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    const resetBtn = modal.querySelector('.btn-secondary');
    resetBtn.addEventListener('click', () => {
        // Reset all checkboxes
        modal.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    });
    
    const applyBtn = modal.querySelector('.btn-primary');
    applyBtn.addEventListener('click', () => {
        // Get selected filters
        const rarityFilters = [];
        const conditionFilters = [];
        const protectionFilters = [];
        
        // Rarity filters
        modal.querySelectorAll('input[value="Common"], input[value="Uncommon"], input[value="Holo Rare"], input[value="Alternate Art"], input[value="Chase"]').forEach(checkbox => {
            if (checkbox.checked) {
                rarityFilters.push(checkbox.value);
            }
        });
        
        // Condition filters
        modal.querySelectorAll('input[value="Mint"], input[value="Near Mint"], input[value="Excellent"], input[value="Good"], input[value="Poor"]').forEach(checkbox => {
            if (checkbox.checked) {
                conditionFilters.push(checkbox.value);
            }
        });
        
        // Protection filters
        modal.querySelectorAll('input[value="sleeved"], input[value="toploadered"], input[value="unprotected"]').forEach(checkbox => {
            if (checkbox.checked) {
                protectionFilters.push(checkbox.value);
            }
        });
        
        // Update game state
        gameState.ui.filters.rarity = rarityFilters;
        gameState.ui.filters.condition = conditionFilters;
        gameState.ui.filters.protection = protectionFilters;
        
        // Re-render collection if we're on that view
        if (gameState.ui.currentView === 'collection') {
            const collectionGrid = document.getElementById('collection-grid');
            if (collectionGrid) {
                renderFilteredCollection(collectionGrid);
            }
        }
        
        // Close modal
        document.body.removeChild(modal);
    });
}

// Show sort modal
function showSortModal() {
    // Get the template
    const template = document.getElementById('sort-modal-template');
    const clone = document.importNode(template.content, true);
    
    // Add to body
    document.body.appendChild(clone);
    
    // Get the modal
    const modal = document.querySelector('.modal-overlay');
    
    // Set current sort
    const sortByRadios = modal.querySelectorAll('input[name="sort-by"]');
    sortByRadios.forEach(radio => {
        if (radio.value === gameState.ui.sort.by) {
            radio.checked = true;
        }
    });
    
    const sortOrderRadios = modal.querySelectorAll('input[name="sort-order"]');
    sortOrderRadios.forEach(radio => {
        if (radio.value === gameState.ui.sort.order) {
            radio.checked = true;
        }
    });
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    const resetBtn = modal.querySelector('.btn-secondary');
    resetBtn.addEventListener('click', () => {
        // Reset to defaults
        modal.querySelector('input[value="doodledexNum"]').checked = true;
        modal.querySelector('input[value="asc"]').checked = true;
    });
    
    const applyBtn = modal.querySelector('.btn-primary');
    applyBtn.addEventListener('click', () => {
        // Get selected sort
        const sortBy = modal.querySelector('input[name="sort-by"]:checked').value;
        const sortOrder = modal.querySelector('input[name="sort-order"]:checked').value;
        
        // Update game state
        gameState.ui.sort.by = sortBy;
        gameState.ui.sort.order = sortOrder;
        
        // Re-render collection if we're on that view
        if (gameState.ui.currentView === 'collection') {
            const collectionGrid = document.getElementById('collection-grid');
            if (collectionGrid) {
                renderFilteredCollection(collectionGrid);
            }
        }
        
        // Close modal
        document.body.removeChild(modal);
    });
}

// Weighted random choice
function weightedRandomChoice(weights) {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const rand = Math.random() * totalWeight;
    
    let cumulativeWeight = 0;
    for (const [item, weight] of Object.entries(weights)) {
        cumulativeWeight += weight;
        if (rand <= cumulativeWeight) {
            return item;
        }
    }
    
    // Fallback
    return Object.keys(weights)[0];
}

// Generate unique ID
function generateUid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add a message to the log feed
function logMessage(message, type = "info") {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    // Add timestamp
    const timestamp = new Date().toLocaleTimeString();
    
    // Style based on message type
    let typeClass = 'text-gray-300';
    let prefix = '';
    
    switch(type) {
        case 'system':
            typeClass = 'text-blue-400';
            prefix = '🔧 ';
            break;
        case 'market':
            typeClass = 'text-green-400';
            prefix = '📈 ';
            break;
        case 'achievement':
            typeClass = 'text-yellow-400';
            prefix = '🏆 ';
            break;
        case 'error':
            typeClass = 'text-red-400';
            prefix = '❌ ';
            break;
        case 'card':
            typeClass = 'text-purple-400';
            prefix = '🃏 ';
            break;
    }
    
    logEntry.className += ` ${typeClass}`;
    logEntry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> ${prefix}${message}`;
    
    // Add to log feed
    if (DOM.logFeed) {
        DOM.logFeed.insertBefore(logEntry, DOM.logFeed.firstChild);
        
        // Limit log entries to prevent performance issues
        while (DOM.logFeed.children.length > 50) {
            DOM.logFeed.removeChild(DOM.logFeed.lastChild);
        }
    }
}

// Update UI elements with current game state
function updateUI() {
    // Update player stats
    DOM.playerCash.textContent = `$${gameState.player.cash.toFixed(2)}`;
    DOM.playerNetWorth.textContent = `$${(gameState.player.cash + calculateCollectionValue()).toFixed(2)}`;
    DOM.playerSleeves.textContent = gameState.player.supplies.sleeves;
    DOM.playerToploaders.textContent = gameState.player.supplies.toploaders;
    
    // Update date
    DOM.gameDate.textContent = `Year ${gameState.date.year}, Day ${gameState.date.day}`;
}

// Save game
function saveGame() {
    try {
        localStorage.setItem('cardboardCapitalistSave', JSON.stringify({
            gameState,
            achievements: ACHIEVEMENTS,
            saveDate: new Date().toISOString()
        }));
        console.log("Game saved successfully");
        return true;
    } catch (error) {
        console.error("Error saving game:", error);
        return false;
    }
}

// Load game
function loadGame() {
    try {
        const saveData = localStorage.getItem('cardboardCapitalistSave');
        if (!saveData) return false;
        
        const parsedData = JSON.parse(saveData);
        
        // Restore game state
        Object.assign(gameState, parsedData.gameState);
        
        // Restore achievements
        if (parsedData.achievements) {
            Object.keys(parsedData.achievements).forEach(key => {
                if (ACHIEVEMENTS[key]) {
                    ACHIEVEMENTS[key].unlocked = parsedData.achievements[key].unlocked;
                    ACHIEVEMENTS[key].unlockedDate = parsedData.achievements[key].unlockedDate;
                }
            });
        }
        
        console.log("Game loaded successfully");
        logMessage("Game loaded successfully", "system");
        return true;
    } catch (error) {
        console.error("Error loading game:", error);
        return false;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);