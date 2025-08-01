// Card Grading System for Cardboard Capitalist
// This module implements professional card grading mechanics

/**
 * Grading scale and criteria
 */
const GRADING_SCALE = {
    10: {
        name: "Gem Mint",
        description: "Perfect card in every way. Pristine condition with no imperfections.",
        valueMultiplier: 3.0, // 3x base value
        criteria: {
            centering: 0.98, // 98%+ perfect centering
            corners: 0.98,   // 98%+ perfect corners
            edges: 0.98,     // 98%+ perfect edges
            surface: 0.98    // 98%+ perfect surface
        }
    },
    9: {
        name: "Mint",
        description: "Nearly perfect with only the most minor imperfections.",
        valueMultiplier: 2.5, // 2.5x base value
        criteria: {
            centering: 0.95, // 95%+ perfect centering
            corners: 0.95,   // 95%+ perfect corners
            edges: 0.95,     // 95%+ perfect edges
            surface: 0.95    // 95%+ perfect surface
        }
    },
    8: {
        name: "Near Mint-Mint",
        description: "Excellent condition with very minor flaws.",
        valueMultiplier: 2.0, // 2x base value
        criteria: {
            centering: 0.90, // 90%+ perfect centering
            corners: 0.90,   // 90%+ perfect corners
            edges: 0.90,     // 90%+ perfect edges
            surface: 0.90    // 90%+ perfect surface
        }
    },
    7: {
        name: "Near Mint",
        description: "Minor flaws but still excellent condition.",
        valueMultiplier: 1.7, // 1.7x base value
        criteria: {
            centering: 0.85, // 85%+ perfect centering
            corners: 0.85,   // 85%+ perfect corners
            edges: 0.85,     // 85%+ perfect edges
            surface: 0.85    // 85%+ perfect surface
        }
    },
    6: {
        name: "Excellent-Near Mint",
        description: "Slight imperfections visible upon close inspection.",
        valueMultiplier: 1.5, // 1.5x base value
        criteria: {
            centering: 0.80, // 80%+ perfect centering
            corners: 0.80,   // 80%+ perfect corners
            edges: 0.80,     // 80%+ perfect edges
            surface: 0.80    // 80%+ perfect surface
        }
    },
    5: {
        name: "Excellent",
        description: "Minor wear visible but still attractive appearance.",
        valueMultiplier: 1.3, // 1.3x base value
        criteria: {
            centering: 0.75, // 75%+ perfect centering
            corners: 0.75,   // 75%+ perfect corners
            edges: 0.75,     // 75%+ perfect edges
            surface: 0.75    // 75%+ perfect surface
        }
    },
    4: {
        name: "Very Good-Excellent",
        description: "Light wear with minor defects on corners, edges, and surface.",
        valueMultiplier: 1.2, // 1.2x base value
        criteria: {
            centering: 0.70, // 70%+ perfect centering
            corners: 0.70,   // 70%+ perfect corners
            edges: 0.70,     // 70%+ perfect edges
            surface: 0.70    // 70%+ perfect surface
        }
    },
    3: {
        name: "Very Good",
        description: "Moderate wear with noticeable defects.",
        valueMultiplier: 1.1, // 1.1x base value
        criteria: {
            centering: 0.60, // 60%+ perfect centering
            corners: 0.60,   // 60%+ perfect corners
            edges: 0.60,     // 60%+ perfect edges
            surface: 0.60    // 60%+ perfect surface
        }
    },
    2: {
        name: "Good",
        description: "Heavily played with significant wear and defects.",
        valueMultiplier: 1.0, // No change to base value
        criteria: {
            centering: 0.50, // 50%+ perfect centering
            corners: 0.50,   // 50%+ perfect corners
            edges: 0.50,     // 50%+ perfect edges
            surface: 0.50    // 50%+ perfect surface
        }
    },
    1: {
        name: "Poor",
        description: "Heavily damaged but still identifiable and complete.",
        valueMultiplier: 0.8, // 0.8x base value
        criteria: {
            centering: 0.30, // 30%+ perfect centering
            corners: 0.30,   // 30%+ perfect corners
            edges: 0.30,     // 30%+ perfect edges
            surface: 0.30    // 30%+ perfect surface
        }
    }
};

/**
 * Grading service options
 */
const GRADING_SERVICES = {
    STANDARD: {
        name: "Standard",
        description: "10-15 business days turnaround time",
        cost: 15.00,
        daysToComplete: 15,
        maxValue: 500.00 // Maximum card value allowed for this service
    },
    EXPRESS: {
        name: "Express",
        description: "5-7 business days turnaround time",
        cost: 30.00,
        daysToComplete: 7,
        maxValue: 1000.00
    },
    PREMIUM: {
        name: "Premium",
        description: "2-3 business days turnaround time",
        cost: 75.00,
        daysToComplete: 3,
        maxValue: 5000.00
    },
    ULTRA: {
        name: "Ultra",
        description: "1 business day turnaround time",
        cost: 150.00,
        daysToComplete: 1,
        maxValue: Infinity
    }
};

/**
 * Initialize the grading system
 */
function initializeGradingSystem() {
    // Add grading system to game state if it doesn't exist
    if (!gameState.grading) {
        gameState.grading = {
            submittedCards: [],
            completedGradings: [],
            availableServices: Object.keys(GRADING_SERVICES)
        };
    }
    
    // Set up event listeners for grading UI
    setupGradingEventListeners();
}

/**
 * Set up event listeners for grading UI
 */
function setupGradingEventListeners() {
    // Will be implemented when grading UI is created
}

/**
 * Render the grading service view
 */
function renderGradingView() {
    const mainView = document.getElementById('main-view');
    mainView.innerHTML = '';
    
    // Create grading view container
    const gradingView = document.createElement('div');
    gradingView.className = 'grading-view';
    
    gradingView.innerHTML = `
        <h2 class="section-title">Card Grading Service</h2>
        
        <div class="grading-intro">
            <p>Get your cards professionally graded to increase their value and protect them. 
            Graded cards can be worth significantly more than ungraded cards.</p>
        </div>
        
        <div class="grading-tabs">
            <button class="tab-button active" data-tab="submit">Submit Cards</button>
            <button class="tab-button" data-tab="pending">Pending (${gameState.grading.submittedCards.length})</button>
            <button class="tab-button" data-tab="completed">Completed (${gameState.grading.completedGradings.length})</button>
        </div>
        
        <div class="grading-content">
            <div id="submit-tab" class="tab-content active">
                <div class="service-selection">
                    <h3>Select Grading Service</h3>
                    <div class="service-options" id="service-options"></div>
                </div>
                
                <div class="card-selection">
                    <h3>Select Cards to Grade</h3>
                    <div class="card-filter">
                        <input type="text" id="grading-card-filter" placeholder="Filter cards...">
                    </div>
                    <div class="card-grid" id="grading-card-grid"></div>
                </div>
                
                <div class="selected-cards">
                    <h3>Selected Cards</h3>
                    <div class="selected-card-list" id="grading-selected-cards"></div>
                </div>
                
                <div class="grading-summary">
                    <div class="summary-item">
                        <span class="summary-label">Service:</span>
                        <span id="selected-service" class="summary-value">None selected</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Cards:</span>
                        <span id="selected-card-count" class="summary-value">0</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Cost:</span>
                        <span id="grading-cost" class="summary-value">$0.00</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Turnaround:</span>
                        <span id="grading-turnaround" class="summary-value">N/A</span>
                    </div>
                </div>
                
                <button id="submit-grading" class="submit-button" disabled>Submit for Grading</button>
            </div>
            
            <div id="pending-tab" class="tab-content">
                <div class="pending-gradings" id="pending-gradings-list">
                    <p class="empty-message">No cards currently submitted for grading.</p>
                </div>
            </div>
            
            <div id="completed-tab" class="tab-content">
                <div class="completed-gradings" id="completed-gradings-list">
                    <p class="empty-message">No completed gradings yet.</p>
                </div>
            </div>
        </div>
    `;
    
    mainView.appendChild(gradingView);
    
    // Add event listeners for tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            e.target.classList.add('active');
            document.getElementById(`${e.target.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Render service options
    renderGradingServiceOptions();
    
    // Render cards for grading
    renderCardsForGrading();
    
    // Render pending gradings
    renderPendingGradings();
    
    // Render completed gradings
    renderCompletedGradings();
    
    // Add event listener for submit button
    document.getElementById('submit-grading').addEventListener('click', submitCardsForGrading);
    
    // Add event listener for card filter
    document.getElementById('grading-card-filter').addEventListener('input', filterGradingCards);
}

/**
 * Render grading service options
 */
function renderGradingServiceOptions() {
    const serviceOptions = document.getElementById('service-options');
    if (!serviceOptions) return;
    
    serviceOptions.innerHTML = '';
    
    Object.entries(GRADING_SERVICES).forEach(([serviceKey, service]) => {
        const serviceOption = document.createElement('div');
        serviceOption.className = 'service-option';
        serviceOption.dataset.service = serviceKey;
        
        serviceOption.innerHTML = `
            <div class="service-header">
                <h4 class="service-name">${service.name}</h4>
                <div class="service-cost">$${service.cost.toFixed(2)}</div>
            </div>
            <div class="service-description">${service.description}</div>
            <div class="service-max-value">Max Card Value: $${service.maxValue === Infinity ? 'Unlimited' : service.maxValue.toFixed(2)}</div>
        `;
        
        // Add click event to select service
        serviceOption.addEventListener('click', () => {
            document.querySelectorAll('.service-option').forEach(option => {
                option.classList.remove('selected');
            });
            serviceOption.classList.add('selected');
            
            // Update selected service in summary
            document.getElementById('selected-service').textContent = service.name;
            document.getElementById('grading-turnaround').textContent = service.description;
            
            // Update cost in summary
            updateGradingSummary();
            
            // Enable/disable submit button
            updateSubmitButton();
        });
        
        serviceOptions.appendChild(serviceOption);
    });
}

/**
 * Render cards available for grading
 */
function renderCardsForGrading() {
    const cardGrid = document.getElementById('grading-card-grid');
    if (!cardGrid) return;
    
    cardGrid.innerHTML = '';
    
    // Get player's collection
    const collection = gameState.player.collection;
    
    // Render each card that is eligible for grading (not already graded)
    Object.entries(collection).forEach(([cardId, instances]) => {
        instances.forEach(instance => {
            // Skip already graded cards
            if (instance.graded) return;
            
            const card = TCG_CARDS[cardId];
            if (!card) return;
            
            const cardElement = buildCardElement(card, instance);
            cardElement.classList.add('grading-card');
            
            // Add click event to select/deselect card
            cardElement.addEventListener('click', () => {
                toggleGradingCardSelection(cardId, instance);
                cardElement.classList.toggle('selected');
            });
            
            cardGrid.appendChild(cardElement);
        });
    });
}

/**
 * Toggle selection of a card for grading
 * @param {string} cardId - The card ID
 * @param {Object} instance - The card instance
 */
function toggleGradingCardSelection(cardId, instance) {
    // Initialize selected cards array if it doesn't exist
    if (!gameState.grading.selectedCards) {
        gameState.grading.selectedCards = [];
    }
    
    const selectedCards = gameState.grading.selectedCards;
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
    updateSelectedGradingCards();
    
    // Update summary
    updateGradingSummary();
    
    // Enable/disable submit button
    updateSubmitButton();
}

/**
 * Update the display of selected cards for grading
 */
function updateSelectedGradingCards() {
    const selectedCards = document.getElementById('grading-selected-cards');
    if (!selectedCards) return;
    
    selectedCards.innerHTML = '';
    
    if (!gameState.grading.selectedCards || gameState.grading.selectedCards.length === 0) {
        selectedCards.innerHTML = '<p class="empty-message">No cards selected</p>';
        return;
    }
    
    gameState.grading.selectedCards.forEach(card => {
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
        selectedCards.appendChild(miniCard);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-card').forEach(button => {
        button.addEventListener('click', (e) => {
            const uid = e.target.dataset.uid;
            const index = gameState.grading.selectedCards.findIndex(c => c.instance.uid === uid);
            if (index >= 0) {
                gameState.grading.selectedCards.splice(index, 1);
                updateSelectedGradingCards();
                updateGradingSummary();
                updateSubmitButton();
                
                // Also update the selection in the grid
                const cardElement = document.querySelector(`.grading-card[data-instance-uid="${uid}"]`);
                if (cardElement) {
                    cardElement.classList.remove('selected');
                }
            }
        });
    });
}

/**
 * Update the grading summary
 */
function updateGradingSummary() {
    // Update card count
    const cardCount = gameState.grading.selectedCards ? gameState.grading.selectedCards.length : 0;
    document.getElementById('selected-card-count').textContent = cardCount;
    
    // Get selected service
    const selectedServiceElement = document.querySelector('.service-option.selected');
    if (!selectedServiceElement) {
        document.getElementById('grading-cost').textContent = '$0.00';
        return;
    }
    
    const serviceKey = selectedServiceElement.dataset.service;
    const service = GRADING_SERVICES[serviceKey];
    
    // Calculate cost
    const cost = service.cost * cardCount;
    document.getElementById('grading-cost').textContent = `$${cost.toFixed(2)}`;
}

/**
 * Enable or disable the submit button based on selection
 */
function updateSubmitButton() {
    const submitButton = document.getElementById('submit-grading');
    const cardCount = gameState.grading.selectedCards ? gameState.grading.selectedCards.length : 0;
    const selectedService = document.querySelector('.service-option.selected');
    
    if (cardCount > 0 && selectedService && gameState.player.cash >= parseFloat(document.getElementById('grading-cost').textContent.replace('$', ''))) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

/**
 * Filter cards based on search input
 */
function filterGradingCards() {
    const filterText = document.getElementById('grading-card-filter').value.toLowerCase();
    const cards = document.querySelectorAll('#grading-card-grid .grading-card');
    
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
 * Submit cards for grading
 */
function submitCardsForGrading() {
    // Get selected service
    const selectedServiceElement = document.querySelector('.service-option.selected');
    if (!selectedServiceElement) return;
    
    const serviceKey = selectedServiceElement.dataset.service;
    const service = GRADING_SERVICES[serviceKey];
    
    // Get selected cards
    const selectedCards = gameState.grading.selectedCards || [];
    if (selectedCards.length === 0) return;
    
    // Calculate cost
    const cost = service.cost * selectedCards.length;
    
    // Check if player has enough cash
    if (gameState.player.cash < cost) {
        showMessage("You don't have enough cash for this grading service.", "error");
        return;
    }
    
    // Check if cards exceed max value for service
    for (const card of selectedCards) {
        const cardInfo = TCG_CARDS[card.id];
        const cardValue = calculateCardValue(cardInfo, card.instance);
        
        if (cardValue > service.maxValue) {
            showMessage(`${cardInfo.name} exceeds the maximum value for ${service.name} service. Please select a higher tier service.`, "error");
            return;
        }
    }
    
    // Deduct cost from player's cash
    gameState.player.cash -= cost;
    
    // Create submission record
    const submission = {
        id: generateUniqueId(),
        service: serviceKey,
        cards: selectedCards,
        submittedDate: { ...gameState.date },
        completionDate: {
            year: gameState.date.year,
            day: gameState.date.day + service.daysToComplete
        },
        cost: cost,
        status: 'pending'
    };
    
    // Add to submitted cards
    gameState.grading.submittedCards.push(submission);
    
    // Remove cards from player's collection
    selectedCards.forEach(card => {
        const cardId = card.id;
        const instanceUid = card.instance.uid;
        
        const cardIndex = gameState.player.collection[cardId].findIndex(c => c.uid === instanceUid);
        if (cardIndex >= 0) {
            gameState.player.collection[cardId].splice(cardIndex, 1);
        }
    });
    
    // Clear selected cards
    gameState.grading.selectedCards = [];
    
    // Show success message
    showMessage(`${selectedCards.length} cards submitted for grading. They will be returned on Year ${submission.completionDate.year}, Day ${submission.completionDate.day}.`, "success");
    
    // Update UI
    updateUI();
    renderGradingView();
}

/**
 * Render pending gradings
 */
function renderPendingGradings() {
    const pendingList = document.getElementById('pending-gradings-list');
    if (!pendingList) return;
    
    if (!gameState.grading.submittedCards || gameState.grading.submittedCards.length === 0) {
        pendingList.innerHTML = '<p class="empty-message">No cards currently submitted for grading.</p>';
        return;
    }
    
    pendingList.innerHTML = '';
    
    gameState.grading.submittedCards.forEach(submission => {
        const submissionElement = document.createElement('div');
        submissionElement.className = 'grading-submission';
        
        const service = GRADING_SERVICES[submission.service];
        
        submissionElement.innerHTML = `
            <div class="submission-header">
                <h4>Submission #${submission.id}</h4>
                <div class="submission-service">${service.name} Service</div>
            </div>
            <div class="submission-details">
                <div class="submission-item">
                    <span class="detail-label">Submitted:</span>
                    <span class="detail-value">Year ${submission.submittedDate.year}, Day ${submission.submittedDate.day}</span>
                </div>
                <div class="submission-item">
                    <span class="detail-label">Expected Return:</span>
                    <span class="detail-value">Year ${submission.completionDate.year}, Day ${submission.completionDate.day}</span>
                </div>
                <div class="submission-item">
                    <span class="detail-label">Cards:</span>
                    <span class="detail-value">${submission.cards.length}</span>
                </div>
                <div class="submission-item">
                    <span class="detail-label">Cost:</span>
                    <span class="detail-value">$${submission.cost.toFixed(2)}</span>
                </div>
            </div>
            <div class="submission-cards">
                <h5>Submitted Cards</h5>
                <div class="submission-card-list" id="submission-${submission.id}-cards"></div>
            </div>
        `;
        
        pendingList.appendChild(submissionElement);
        
        // Render submitted cards
        const cardList = document.getElementById(`submission-${submission.id}-cards`);
        submission.cards.forEach(card => {
            const cardInfo = TCG_CARDS[card.id];
            const miniCard = document.createElement('div');
            miniCard.className = 'mini-card';
            miniCard.innerHTML = `
                <img src="${cardInfo.img}" alt="${cardInfo.name}" class="mini-card-img">
                <div class="mini-card-info">
                    <div class="mini-card-name">${cardInfo.name}</div>
                    <div class="mini-card-condition">${card.instance.condition}</div>
                </div>
            `;
            cardList.appendChild(miniCard);
        });
    });
}

/**
 * Render completed gradings
 */
function renderCompletedGradings() {
    const completedList = document.getElementById('completed-gradings-list');
    if (!completedList) return;
    
    if (!gameState.grading.completedGradings || gameState.grading.completedGradings.length === 0) {
        completedList.innerHTML = '<p class="empty-message">No completed gradings yet.</p>';
        return;
    }
    
    completedList.innerHTML = '';
    
    gameState.grading.completedGradings.forEach(grading => {
        const gradingElement = document.createElement('div');
        gradingElement.className = 'completed-grading';
        
        const service = GRADING_SERVICES[grading.service];
        
        gradingElement.innerHTML = `
            <div class="grading-header">
                <h4>Grading #${grading.id}</h4>
                <div class="grading-service">${service.name} Service</div>
            </div>
            <div class="grading-details">
                <div class="grading-item">
                    <span class="detail-label">Submitted:</span>
                    <span class="detail-value">Year ${grading.submittedDate.year}, Day ${grading.submittedDate.day}</span>
                </div>
                <div class="grading-item">
                    <span class="detail-label">Completed:</span>
                    <span class="detail-value">Year ${grading.completionDate.year}, Day ${grading.completionDate.day}</span>
                </div>
                <div class="grading-item">
                    <span class="detail-label">Cards:</span>
                    <span class="detail-value">${grading.cards.length}</span>
                </div>
            </div>
            <div class="grading-cards">
                <h5>Graded Cards</h5>
                <div class="grading-card-list" id="grading-${grading.id}-cards"></div>
            </div>
        `;
        
        completedList.appendChild(gradingElement);
        
        // Render graded cards
        const cardList = document.getElementById(`grading-${grading.id}-cards`);
        grading.cards.forEach(card => {
            const cardInfo = TCG_CARDS[card.id];
            const miniCard = document.createElement('div');
            miniCard.className = 'mini-card graded';
            miniCard.innerHTML = `
                <img src="${cardInfo.img}" alt="${cardInfo.name}" class="mini-card-img">
                <div class="mini-card-info">
                    <div class="mini-card-name">${cardInfo.name}</div>
                    <div class="mini-card-grade">Grade: ${card.instance.graded}</div>
                </div>
                <div class="grade-label">${GRADING_SCALE[card.instance.graded].name}</div>
            `;
            cardList.appendChild(miniCard);
        });
    });
}

/**
 * Check for completed gradings
 * Called during day advancement
 */
function checkCompletedGradings() {
    if (!gameState.grading || !gameState.grading.submittedCards) return;
    
    const currentDate = gameState.date;
    const completedSubmissions = [];
    
    // Check for completed submissions
    gameState.grading.submittedCards = gameState.grading.submittedCards.filter(submission => {
        // Check if completion date has been reached
        if (currentDate.year > submission.completionDate.year || 
            (currentDate.year === submission.completionDate.year && 
             currentDate.day >= submission.completionDate.day)) {
            
            // Grade the cards
            submission.cards.forEach(card => {
                card.instance.graded = gradeCard(card.id, card.instance);
            });
            
            // Update completion date to current date
            submission.completionDate = { ...currentDate };
            submission.status = 'completed';
            
            // Add to completed gradings
            completedSubmissions.push(submission);
            
            // Return cards to player's collection
            submission.cards.forEach(card => {
                if (!gameState.player.collection[card.id]) {
                    gameState.player.collection[card.id] = [];
                }
                gameState.player.collection[card.id].push(card.instance);
            });
            
            // Show notification
            showMessage(`Your graded cards have returned! ${submission.cards.length} cards have been professionally graded.`, "success");
            
            // Remove from submitted cards
            return false;
        }
        return true;
    });
    
    // Add completed submissions to completed gradings
    if (completedSubmissions.length > 0) {
        if (!gameState.grading.completedGradings) {
            gameState.grading.completedGradings = [];
        }
        gameState.grading.completedGradings.push(...completedSubmissions);
    }
}

/**
 * Grade a card
 * @param {string} cardId - The card ID
 * @param {Object} instance - The card instance
 * @returns {number} - The grade (1-10)
 */
function gradeCard(cardId, instance) {
    // Base grade depends on condition
    let baseGrade;
    switch (instance.condition) {
        case "Mint":
            baseGrade = Math.floor(Math.random() * 3) + 8; // 8-10
            break;
        case "Near Mint":
            baseGrade = Math.floor(Math.random() * 3) + 6; // 6-8
            break;
        case "Excellent":
            baseGrade = Math.floor(Math.random() * 3) + 4; // 4-6
            break;
        case "Good":
            baseGrade = Math.floor(Math.random() * 3) + 2; // 2-4
            break;
        case "Fair":
            baseGrade = Math.floor(Math.random() * 2) + 1; // 1-2
            break;
        case "Poor":
            baseGrade = 1; // Always 1
            break;
        default:
            baseGrade = Math.floor(Math.random() * 5) + 1; // 1-5
    }
    
    // Protection can improve grade slightly
    if (instance.protected) {
        if (instance.protected.sleeved) baseGrade = Math.min(10, baseGrade + 1);
        if (instance.protected.toploader) baseGrade = Math.min(10, baseGrade + 1);
    }
    
    // Small random factor
    const randomFactor = Math.random();
    if (randomFactor > 0.9 && baseGrade < 10) baseGrade += 1;
    if (randomFactor < 0.1 && baseGrade > 1) baseGrade -= 1;
    
    return baseGrade;
}

/**
 * Calculate the value of a graded card
 * @param {Object} card - The card data
 * @param {Object} instance - The card instance with grade
 * @returns {number} - The graded card value
 */
function calculateGradedCardValue(card, instance) {
    // Get base value
    const baseValue = calculateCardValue(card, instance);
    
    // Apply grade multiplier
    const grade = instance.graded;
    if (!grade) return baseValue; // Not graded
    
    const gradeInfo = GRADING_SCALE[grade];
    if (!gradeInfo) return baseValue; // Invalid grade
    
    return baseValue * gradeInfo.valueMultiplier;
}

/**
 * Generate a unique ID for grading submissions
 * @returns {string} - Unique ID
 */
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

/**
 * Show a message to the user
 * @param {string} message - The message to show
 * @param {string} type - The message type (success, error, info)
 */
function showMessage(message, type) {
    // Use the game's existing message system if available
    if (typeof logMessage === 'function') {
        logMessage(message, type);
    } else {
        console.log(`[${type}] ${message}`);
    }
}

// Export functions for use in main game
window.gradingSystem = {
    initializeGradingSystem,
    renderGradingView,
    checkCompletedGradings,
    calculateGradedCardValue,
    GRADING_SCALE
};