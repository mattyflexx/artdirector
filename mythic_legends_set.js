// Mythic Legends Card Set for Cardboard Capitalist
// This module implements a new card set with unique mechanics and themes

/**
 * Mythic Legends set configuration
 */
const MYTHIC_LEGENDS_SET = {
    id: "mythic_legends",
    name: "Mythic Legends",
    description: "Ancient creatures of myth and legend come to life in this powerful set.",
    releaseYear: 2,
    packPrice: 12.99,
    packContents: {
        cardCount: 10,
        distribution: {
            "Common": 6,
            "Uncommon": 2,
            "Rare": 1,
            "Ultra Rare": 0.8,
            "Secret Rare": 0.2,
            "Mythic Rare": 0.1 // New rarity level exclusive to this set
        }
    },
    specialMechanics: ["Legendary", "Ancient Power", "Mythic Evolution"],
    cardBackImage: "assets/mythic_legends_back.png",
    packImage: "assets/pack_mythic_legends.png"
};

/**
 * Mythic Legends cards
 */
const MYTHIC_LEGENDS_CARDS = {
    "ML-001": {
        id: "ML-001",
        name: "Drakonyx",
        doodledexNum: 201,
        rarity: "Ultra Rare",
        type: ["Fire", "Dragon"],
        description: "An ancient dragon whose fiery breath can melt mountains.",
        lore: "Legends say that Drakonyx was born from the first volcano that ever erupted on Earth.",
        img: "assets/mythic_legends/drakonyx.png",
        set: "mythic_legends",
        layout: "Standard",
        specialMechanic: "Ancient Power",
        evolutionChain: ["ML-002", "ML-003"]
    },
    "ML-002": {
        id: "ML-002",
        name: "Inferdrake",
        doodledexNum: 202,
        rarity: "Rare",
        type: ["Fire", "Dragon"],
        description: "A powerful drake that leaves trails of flame wherever it flies.",
        lore: "The adolescent form of Drakonyx, already capable of creating devastating forest fires.",
        img: "assets/mythic_legends/inferdrake.png",
        set: "mythic_legends",
        layout: "Standard",
        specialMechanic: "Ancient Power",
        evolutionChain: ["ML-001"]
    },
    "ML-003": {
        id: "ML-003",
        name: "Emberspark",
        doodledexNum: 203,
        rarity: "Uncommon",
        type: ["Fire"],
        description: "A small creature made of living embers.",
        lore: "The first stage of the mighty Drakonyx, already showing signs of its fiery potential.",
        img: "assets/mythic_legends/emberspark.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-002", "ML-001"]
    },
    "ML-004": {
        id: "ML-004",
        name: "Poseidra",
        doodledexNum: 204,
        rarity: "Ultra Rare",
        type: ["Water", "Mythical"],
        description: "A sea deity that can control the tides and summon devastating tsunamis.",
        lore: "Ancient sailors would make offerings to Poseidra before long voyages, hoping for safe passage.",
        img: "assets/mythic_legends/poseidra.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Legendary"
    },
    "ML-005": {
        id: "ML-005",
        name: "Krakenus",
        doodledexNum: 205,
        rarity: "Rare",
        type: ["Water", "Beast"],
        description: "A massive sea monster that can drag entire ships to the depths.",
        lore: "Many ships have been lost to the powerful tentacles of Krakenus.",
        img: "assets/mythic_legends/krakenus.png",
        set: "mythic_legends",
        layout: "Standard",
        specialMechanic: "Ancient Power"
    },
    "ML-006": {
        id: "ML-006",
        name: "Gaiarus",
        doodledexNum: 206,
        rarity: "Mythic Rare",
        type: ["Earth", "Mythical"],
        description: "The embodiment of the planet itself, capable of causing earthquakes with a single step.",
        lore: "It is said that Gaiarus sleeps deep beneath the earth, awakening only in times of great need.",
        img: "assets/mythic_legends/gaiarus.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Legendary"
    },
    "ML-007": {
        id: "ML-007",
        name: "Terraquake",
        doodledexNum: 207,
        rarity: "Rare",
        type: ["Earth", "Rock"],
        description: "A creature that can cause localized earthquakes by stomping its massive feet.",
        lore: "Mountain villages have learned to recognize the approaching footsteps of Terraquake.",
        img: "assets/mythic_legends/terraquake.png",
        set: "mythic_legends",
        layout: "Standard"
    },
    "ML-008": {
        id: "ML-008",
        name: "Zephyrix",
        doodledexNum: 208,
        rarity: "Ultra Rare",
        type: ["Air", "Mythical"],
        description: "A wind spirit that can create devastating tornadoes with a flap of its wings.",
        lore: "Zephyrix is said to live in the eye of eternal storms, controlling the world's weather patterns.",
        img: "assets/mythic_legends/zephyrix.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Ancient Power"
    },
    "ML-009": {
        id: "ML-009",
        name: "Stormwing",
        doodledexNum: 209,
        rarity: "Rare",
        type: ["Air", "Electric"],
        description: "A bird-like creature that can summon lightning storms.",
        lore: "The beating of Stormwing's wings sounds like rolling thunder.",
        img: "assets/mythic_legends/stormwing.png",
        set: "mythic_legends",
        layout: "Standard"
    },
    "ML-010": {
        id: "ML-010",
        name: "Chronos",
        doodledexNum: 210,
        rarity: "Mythic Rare",
        type: ["Cosmic", "Mythical"],
        description: "The keeper of time itself, able to accelerate, slow, or even stop the flow of time.",
        lore: "Chronos exists in all moments simultaneously, watching over the timeline of the universe.",
        img: "assets/mythic_legends/chronos.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Legendary"
    },
    "ML-011": {
        id: "ML-011",
        name: "Temporalis",
        doodledexNum: 211,
        rarity: "Ultra Rare",
        type: ["Cosmic", "Psychic"],
        description: "A creature that can glimpse into the future and past.",
        lore: "Those who encounter Temporalis often report experiencing visions of their own timeline.",
        img: "assets/mythic_legends/temporalis.png",
        set: "mythic_legends",
        layout: "Standard",
        specialMechanic: "Ancient Power"
    },
    "ML-012": {
        id: "ML-012",
        name: "Lumina",
        doodledexNum: 212,
        rarity: "Rare",
        type: ["Light", "Fairy"],
        description: "A being of pure light that can illuminate the darkest places.",
        lore: "Ancient civilizations built temples to Lumina, praying for guidance in dark times.",
        img: "assets/mythic_legends/lumina.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-013"]
    },
    "ML-013": {
        id: "ML-013",
        name: "Solarus",
        doodledexNum: 213,
        rarity: "Ultra Rare",
        type: ["Light", "Fire", "Mythical"],
        description: "The embodiment of the sun, radiating intense heat and light.",
        lore: "Solarus appears only once every thousand years, bringing a summer that lasts twice as long.",
        img: "assets/mythic_legends/solarus.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Mythic Evolution"
    },
    "ML-014": {
        id: "ML-014",
        name: "Umbra",
        doodledexNum: 214,
        rarity: "Rare",
        type: ["Dark", "Ghost"],
        description: "A shadow being that can move through darkness and possess objects.",
        lore: "Umbra is said to be the first shadow ever cast in the world.",
        img: "assets/mythic_legends/umbra.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-015"]
    },
    "ML-015": {
        id: "ML-015",
        name: "Eclipsis",
        doodledexNum: 215,
        rarity: "Ultra Rare",
        type: ["Dark", "Cosmic", "Mythical"],
        description: "The embodiment of darkness, capable of creating areas of absolute darkness.",
        lore: "When Eclipsis and Solarus meet, a celestial eclipse occurs that affects all creatures.",
        img: "assets/mythic_legends/eclipsis.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Mythic Evolution"
    },
    "ML-016": {
        id: "ML-016",
        name: "Frostbite",
        doodledexNum: 216,
        rarity: "Uncommon",
        type: ["Ice"],
        description: "A small ice creature that can freeze anything it touches.",
        lore: "Frostbite creatures are born during the harshest blizzards.",
        img: "assets/mythic_legends/frostbite.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-017", "ML-018"]
    },
    "ML-017": {
        id: "ML-017",
        name: "Glacius",
        doodledexNum: 217,
        rarity: "Rare",
        type: ["Ice", "Water"],
        description: "A powerful ice elemental that can create ice structures and weapons.",
        lore: "Ancient ice fortresses found in the polar regions are said to be the work of Glacius.",
        img: "assets/mythic_legends/glacius.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-018"]
    },
    "ML-018": {
        id: "ML-018",
        name: "Borealis",
        doodledexNum: 218,
        rarity: "Ultra Rare",
        type: ["Ice", "Light", "Mythical"],
        description: "The spirit of the northern lights, wielding beautiful but deadly ice magic.",
        lore: "The dancing lights in the northern sky are actually Borealis moving across the heavens.",
        img: "assets/mythic_legends/borealis.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Mythic Evolution"
    },
    "ML-019": {
        id: "ML-019",
        name: "Florafae",
        doodledexNum: 219,
        rarity: "Common",
        type: ["Plant", "Fairy"],
        description: "A small nature spirit that helps plants grow and flourish.",
        lore: "Gardens visited by Florafae bloom year-round, regardless of season.",
        img: "assets/mythic_legends/florafae.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-020", "ML-021"]
    },
    "ML-020": {
        id: "ML-020",
        name: "Sylvanus",
        doodledexNum: 220,
        rarity: "Uncommon",
        type: ["Plant", "Earth"],
        description: "A forest guardian that can control plants and communicate with trees.",
        lore: "Ancient forests are often home to Sylvanus, who protects them from harm.",
        img: "assets/mythic_legends/sylvanus.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-021"]
    },
    "ML-021": {
        id: "ML-021",
        name: "Gaia's Heart",
        doodledexNum: 221,
        rarity: "Mythic Rare",
        type: ["Plant", "Earth", "Mythical"],
        description: "The embodiment of nature's power, capable of creating entire forests instantly.",
        lore: "It is said that the first forests on Earth grew from seeds planted by Gaia's Heart.",
        img: "assets/mythic_legends/gaias_heart.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Mythic Evolution"
    },
    "ML-022": {
        id: "ML-022",
        name: "Sparklet",
        doodledexNum: 222,
        rarity: "Common",
        type: ["Electric"],
        description: "A small electric creature that generates static electricity.",
        lore: "Sparklets are often found near power lines, feeding on the electrical current.",
        img: "assets/mythic_legends/sparklet.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-023", "ML-024"]
    },
    "ML-023": {
        id: "ML-023",
        name: "Voltaic",
        doodledexNum: 223,
        rarity: "Uncommon",
        type: ["Electric", "Metal"],
        description: "A creature made of living electricity that can power machines.",
        lore: "During thunderstorms, Voltaic can be seen riding the lightning bolts.",
        img: "assets/mythic_legends/voltaic.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-024"]
    },
    "ML-024": {
        id: "ML-024",
        name: "Thundergod",
        doodledexNum: 224,
        rarity: "Ultra Rare",
        type: ["Electric", "Air", "Mythical"],
        description: "A deity of thunder and lightning, capable of creating devastating electrical storms.",
        lore: "Ancient cultures built temples on mountaintops to honor Thundergod.",
        img: "assets/mythic_legends/thundergod.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Mythic Evolution"
    },
    "ML-025": {
        id: "ML-025",
        name: "Psyshock",
        doodledexNum: 225,
        rarity: "Uncommon",
        type: ["Psychic"],
        description: "A creature with powerful psychic abilities that can read minds.",
        lore: "Those who encounter Psyshock often report hearing whispers of their own thoughts.",
        img: "assets/mythic_legends/psyshock.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-026"]
    },
    "ML-026": {
        id: "ML-026",
        name: "Mentalis",
        doodledexNum: 226,
        rarity: "Rare",
        type: ["Psychic", "Cosmic"],
        description: "A powerful psychic entity that can manipulate reality with its mind.",
        lore: "Reality seems to bend around Mentalis, creating strange phenomena.",
        img: "assets/mythic_legends/mentalis.png",
        set: "mythic_legends",
        layout: "Standard",
        specialMechanic: "Ancient Power"
    },
    "ML-027": {
        id: "ML-027",
        name: "Metallion",
        doodledexNum: 227,
        rarity: "Uncommon",
        type: ["Metal", "Earth"],
        description: "A creature made of living metal that can reshape its body at will.",
        lore: "Ancient blacksmiths would pray to Metallion for help with difficult forgings.",
        img: "assets/mythic_legends/metallion.png",
        set: "mythic_legends",
        layout: "Standard"
    },
    "ML-028": {
        id: "ML-028",
        name: "Forgemaster",
        doodledexNum: 228,
        rarity: "Rare",
        type: ["Metal", "Fire"],
        description: "A legendary smith that can create magical weapons and armor.",
        lore: "The most powerful artifacts in history were crafted by Forgemaster.",
        img: "assets/mythic_legends/forgemaster.png",
        set: "mythic_legends",
        layout: "Standard",
        specialMechanic: "Ancient Power"
    },
    "ML-029": {
        id: "ML-029",
        name: "Toxica",
        doodledexNum: 229,
        rarity: "Common",
        type: ["Poison"],
        description: "A small poisonous creature that can contaminate water sources.",
        lore: "Toxica evolved in the most polluted areas, thriving where other creatures perish.",
        img: "assets/mythic_legends/toxica.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-030"]
    },
    "ML-030": {
        id: "ML-030",
        name: "Venomous",
        doodledexNum: 230,
        rarity: "Uncommon",
        type: ["Poison", "Dark"],
        description: "A creature that can produce various toxins and poisons.",
        lore: "Alchemists once sought out Venomous for its unique toxic compounds.",
        img: "assets/mythic_legends/venomous.png",
        set: "mythic_legends",
        layout: "Standard"
    },
    "ML-031": {
        id: "ML-031",
        name: "Rockslide",
        doodledexNum: 231,
        rarity: "Common",
        type: ["Rock"],
        description: "A creature made of living stones that can cause small avalanches.",
        lore: "Mountain paths are often blocked by Rockslide's playful antics.",
        img: "assets/mythic_legends/rockslide.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-032"]
    },
    "ML-032": {
        id: "ML-032",
        name: "Bouldergeist",
        doodledexNum: 232,
        rarity: "Uncommon",
        type: ["Rock", "Ghost"],
        description: "A spirit that inhabits massive boulders, bringing them to life.",
        lore: "Ancient stone circles are said to be Bouldergeists frozen in time.",
        img: "assets/mythic_legends/bouldergeist.png",
        set: "mythic_legends",
        layout: "Standard"
    },
    "ML-033": {
        id: "ML-033",
        name: "Spectralis",
        doodledexNum: 233,
        rarity: "Uncommon",
        type: ["Ghost"],
        description: "A ghostly entity that can pass through solid objects.",
        lore: "Haunted houses are often home to playful Spectralis.",
        img: "assets/mythic_legends/spectralis.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-034"]
    },
    "ML-034": {
        id: "ML-034",
        name: "Phantomus",
        doodledexNum: 234,
        rarity: "Rare",
        type: ["Ghost", "Dark"],
        description: "A powerful spirit that can possess objects and people.",
        lore: "Ancient exorcism rituals were developed specifically to banish Phantomus.",
        img: "assets/mythic_legends/phantomus.png",
        set: "mythic_legends",
        layout: "Standard"
    },
    "ML-035": {
        id: "ML-035",
        name: "Buglet",
        doodledexNum: 235,
        rarity: "Common",
        type: ["Bug"],
        description: "A small insect creature that can communicate with other bugs.",
        lore: "Gardens with Buglet populations are always perfectly balanced ecosystems.",
        img: "assets/mythic_legends/buglet.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-036", "ML-037"]
    },
    "ML-036": {
        id: "ML-036",
        name: "Swarmind",
        doodledexNum: 236,
        rarity: "Uncommon",
        type: ["Bug", "Psychic"],
        description: "A creature that can control swarms of insects with its mind.",
        lore: "Farmers often leave offerings for Swarmind to protect their crops from pests.",
        img: "assets/mythic_legends/swarmind.png",
        set: "mythic_legends",
        layout: "Standard",
        evolutionChain: ["ML-037"]
    },
    "ML-037": {
        id: "ML-037",
        name: "Hivequeen",
        doodledexNum: 237,
        rarity: "Rare",
        type: ["Bug", "Psychic"],
        description: "The ultimate insect controller, capable of commanding millions of bugs simultaneously.",
        lore: "Ancient texts speak of insect plagues caused by angered Hivequeens.",
        img: "assets/mythic_legends/hivequeen.png",
        set: "mythic_legends",
        layout: "Standard"
    },
    "ML-038": {
        id: "ML-038",
        name: "Draconis",
        doodledexNum: 238,
        rarity: "Mythic Rare",
        type: ["Dragon", "Cosmic", "Mythical"],
        description: "The first dragon ever to exist, from which all other dragons descended.",
        lore: "Draconis is said to sleep in the heart of a distant star, awakening only when the universe faces great danger.",
        img: "assets/mythic_legends/draconis.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Legendary"
    },
    "ML-039": {
        id: "ML-039",
        name: "Celestia",
        doodledexNum: 239,
        rarity: "Mythic Rare",
        type: ["Light", "Cosmic", "Mythical"],
        description: "A cosmic entity that embodies the light of all stars in the universe.",
        lore: "It is said that when Celestia dies, all stars will go dark, but when reborn, new stars will ignite across the cosmos.",
        img: "assets/mythic_legends/celestia.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Legendary"
    },
    "ML-040": {
        id: "ML-040",
        name: "Abyssus",
        doodledexNum: 240,
        rarity: "Mythic Rare",
        type: ["Dark", "Cosmic", "Mythical"],
        description: "The embodiment of the void between stars, capable of creating black holes.",
        lore: "Where Abyssus treads, light itself is consumed, leaving only the endless dark.",
        img: "assets/mythic_legends/abyssus.png",
        set: "mythic_legends",
        layout: "Full-Art",
        specialMechanic: "Legendary"
    }
};

/**
 * Initialize the Mythic Legends set
 */
function initializeMythicLegendsSet() {
    // Add set to TCG_SETS if it doesn't exist
    if (!TCG_SETS.mythic_legends) {
        TCG_SETS.mythic_legends = MYTHIC_LEGENDS_SET;
    }
    
    // Add cards to TCG_CARDS
    Object.entries(MYTHIC_LEGENDS_CARDS).forEach(([cardId, card]) => {
        if (!TCG_CARDS[cardId]) {
            TCG_CARDS[cardId] = card;
        }
    });
    
    // Add set to store inventory if it doesn't exist
    if (!gameState.player.sealedInventory.mythic_legends) {
        gameState.player.sealedInventory.mythic_legends = 0;
    }
    
    // Add market events for the new set
    addMythicLegendsMarketEvents();
    
    // Add set rotation mechanics
    implementSetRotationMechanics();
}

/**
 * Add market events specific to Mythic Legends set
 */
function addMythicLegendsMarketEvents() {
    // Add to existing market events array if it exists
    if (!gameState.market.possibleEvents) {
        gameState.market.possibleEvents = [];
    }
    
    // Add new market events
    const mythicLegendsEvents = [
        {
            id: "mythic_legends_release",
            name: "Mythic Legends Release",
            description: "The new Mythic Legends set has been released! Cards from this set are in high demand.",
            effect: {
                type: "set_value_modifier",
                set: "mythic_legends",
                modifier: 1.5,
                duration: 10
            },
            weight: 10,
            oneTime: true,
            triggerCondition: {
                type: "year",
                year: 2,
                day: 1
            }
        },
        {
            id: "mythic_rare_demand",
            name: "Mythic Rare Demand",
            description: "Collectors are seeking Mythic Rare cards! Their value has increased significantly.",
            effect: {
                type: "rarity_value_modifier",
                rarity: "Mythic Rare",
                modifier: 2.0,
                duration: 5
            },
            weight: 5
        },
        {
            id: "legendary_spotlight",
            name: "Legendary Spotlight",
            description: "Cards with the Legendary mechanic are featured in a popular tournament! Their value has increased.",
            effect: {
                type: "mechanic_value_modifier",
                mechanic: "Legendary",
                modifier: 1.7,
                duration: 7
            },
            weight: 5
        },
        {
            id: "mythic_evolution_discovery",
            name: "Mythic Evolution Discovery",
            description: "A new way to use Mythic Evolution cards has been discovered! Their value has increased.",
            effect: {
                type: "mechanic_value_modifier",
                mechanic: "Mythic Evolution",
                modifier: 1.8,
                duration: 6
            },
            weight: 5
        },
        {
            id: "ancient_power_tournament",
            name: "Ancient Power Tournament",
            description: "A tournament featuring Ancient Power cards has begun! Their value has increased.",
            effect: {
                type: "mechanic_value_modifier",
                mechanic: "Ancient Power",
                modifier: 1.6,
                duration: 8
            },
            weight: 5
        },
        {
            id: "mythic_legends_reprint",
            name: "Mythic Legends Reprint",
            description: "Mythic Legends cards are being reprinted! Their value has temporarily decreased.",
            effect: {
                type: "set_value_modifier",
                set: "mythic_legends",
                modifier: 0.7,
                duration: 12
            },
            weight: 3,
            triggerCondition: {
                type: "year",
                year: 3,
                minDay: 180
            }
        }
    ];
    
    // Add events to possible events array
    gameState.market.possibleEvents.push(...mythicLegendsEvents);
}

/**
 * Implement set rotation mechanics
 */
function implementSetRotationMechanics() {
    // Add set rotation data if it doesn't exist
    if (!gameState.market.setRotation) {
        gameState.market.setRotation = {
            activeYears: {
                genesis: { start: 1, end: null }, // Genesis is always active
                mythic_legends: { start: 2, end: 5 } // Mythic Legends rotates out after year 5
            },
            rotationEffects: {
                preRotation: {
                    years: 1, // Effects start 1 year before rotation
                    valueModifier: 1.3 // Value increases by 30% before rotation
                },
                postRotation: {
                    immediate: 0.7, // Value immediately drops to 70% after rotation
                    recovery: {
                        years: 2, // Takes 2 years to recover
                        finalModifier: 1.5 // Eventually becomes worth 150% of original value as a collectible
                    }
                }
            }
        };
    }
}

/**
 * Update set values based on rotation schedule
 * Called during day advancement
 */
function updateSetRotationValues() {
    const currentYear = gameState.date.year;
    const currentDay = gameState.date.day;
    const rotation = gameState.market.setRotation;
    
    if (!rotation) return;
    
    // Check each set for rotation effects
    Object.entries(rotation.activeYears).forEach(([setId, years]) => {
        // Skip if no end year (set never rotates)
        if (!years.end) return;
        
        // Calculate years until rotation
        const yearsUntilRotation = years.end - currentYear;
        
        // Pre-rotation value increase
        if (yearsUntilRotation <= rotation.rotationEffects.preRotation.years && yearsUntilRotation > 0) {
            // Apply pre-rotation value modifier
            applySetValueModifier(setId, rotation.rotationEffects.preRotation.valueModifier, 30);
            
            // Notify player if this just started
            if (yearsUntilRotation === rotation.rotationEffects.preRotation.years && currentDay === 1) {
                showMessage(`The ${TCG_SETS[setId].name} set will rotate out in ${yearsUntilRotation} year(s)! Cards from this set are increasing in value.`, "info");
            }
        }
        // Post-rotation value drop
        else if (currentYear === years.end && currentDay === 1) {
            // Apply immediate post-rotation value drop
            applySetValueModifier(setId, rotation.rotationEffects.postRotation.immediate, 30);
            
            // Notify player
            showMessage(`The ${TCG_SETS[setId].name} set has rotated out! Cards from this set have dropped in value but will become collectibles over time.`, "info");
        }
        // Post-rotation value recovery
        else if (currentYear > years.end) {
            const yearsAfterRotation = currentYear - years.end;
            
            if (yearsAfterRotation <= rotation.rotationEffects.postRotation.recovery.years) {
                // Calculate recovery progress
                const recoveryProgress = yearsAfterRotation / rotation.rotationEffects.postRotation.recovery.years;
                
                // Calculate current modifier based on recovery progress
                const currentModifier = rotation.rotationEffects.postRotation.immediate + 
                    (rotation.rotationEffects.postRotation.recovery.finalModifier - rotation.rotationEffects.postRotation.immediate) * recoveryProgress;
                
                // Apply recovery value modifier
                applySetValueModifier(setId, currentModifier, 30);
            }
            else if (yearsAfterRotation === rotation.rotationEffects.postRotation.recovery.years + 1 && currentDay === 1) {
                // Apply final collectible value
                applySetValueModifier(setId, rotation.rotationEffects.postRotation.recovery.finalModifier, 365);
                
                // Notify player
                showMessage(`The ${TCG_SETS[setId].name} set has become a valuable collectible! Cards from this set are now worth more than their original value.`, "success");
            }
        }
    });
}

/**
 * Apply a value modifier to all cards in a set
 * @param {string} setId - The set ID
 * @param {number} modifier - The value modifier
 * @param {number} duration - Duration in days
 */
function applySetValueModifier(setId, modifier, duration) {
    // Add to market price modifiers
    if (!gameState.market.priceModifiers) {
        gameState.market.priceModifiers = {};
    }
    
    gameState.market.priceModifiers[setId] = {
        modifier: modifier,
        remainingDays: duration
    };
}

/**
 * Generate pack contents for Mythic Legends set
 * @returns {Array} - Array of card IDs
 */
function generateMythicLegendsPack() {
    const packContents = [];
    const distribution = MYTHIC_LEGENDS_SET.packContents.distribution;
    
    // Get all cards by rarity
    const cardsByRarity = {};
    Object.entries(MYTHIC_LEGENDS_CARDS).forEach(([cardId, card]) => {
        if (!cardsByRarity[card.rarity]) {
            cardsByRarity[card.rarity] = [];
        }
        cardsByRarity[card.rarity].push(cardId);
    });
    
    // Generate cards based on distribution
    Object.entries(distribution).forEach(([rarity, count]) => {
        const wholeCount = Math.floor(count);
        const fractionalChance = count - wholeCount;
        
        // Add whole number of cards
        for (let i = 0; i < wholeCount; i++) {
            if (cardsByRarity[rarity] && cardsByRarity[rarity].length > 0) {
                const randomIndex = Math.floor(Math.random() * cardsByRarity[rarity].length);
                packContents.push(cardsByRarity[rarity][randomIndex]);
            }
        }
        
        // Add fractional chance card
        if (Math.random() < fractionalChance) {
            if (cardsByRarity[rarity] && cardsByRarity[rarity].length > 0) {
                const randomIndex = Math.floor(Math.random() * cardsByRarity[rarity].length);
                packContents.push(cardsByRarity[rarity][randomIndex]);
            }
        }
    });
    
    return packContents;
}

/**
 * Create placeholder images for Mythic Legends cards
 * This function creates simple colored rectangles as placeholders
 * In a real implementation, you would use actual card art
 */
function createMythicLegendsPlaceholderImages() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 560;
    const ctx = canvas.getContext('2d');
    
    // Create a directory for the images if it doesn't exist
    const assetsDir = 'assets/mythic_legends';
    
    // For each card, create a placeholder image
    Object.entries(MYTHIC_LEGENDS_CARDS).forEach(([cardId, card]) => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set background color based on type
        let bgColor = '#7e7e7e'; // Default gray
        if (card.type.includes('Fire')) bgColor = '#ff7b00';
        else if (card.type.includes('Water')) bgColor = '#0077ff';
        else if (card.type.includes('Earth')) bgColor = '#8B4513';
        else if (card.type.includes('Air')) bgColor = '#87CEEB';
        else if (card.type.includes('Ice')) bgColor = '#A5F2F3';
        else if (card.type.includes('Electric')) bgColor = '#FFD700';
        else if (card.type.includes('Plant')) bgColor = '#228B22';
        else if (card.type.includes('Psychic')) bgColor = '#FF69B4';
        else if (card.type.includes('Dark')) bgColor = '#4B0082';
        else if (card.type.includes('Light')) bgColor = '#FFFACD';
        else if (card.type.includes('Dragon')) bgColor = '#8B0000';
        else if (card.type.includes('Ghost')) bgColor = '#9370DB';
        else if (card.type.includes('Metal')) bgColor = '#708090';
        else if (card.type.includes('Cosmic')) bgColor = '#483D8B';
        
        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
        
        // Draw card name
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(card.name, canvas.width / 2, 50);
        
        // Draw card type
        ctx.font = '20px Arial';
        ctx.fillText(card.type.join(' / '), canvas.width / 2, 80);
        
        // Draw rarity
        ctx.font = 'bold 24px Arial';
        ctx.fillText(card.rarity, canvas.width / 2, 120);
        
        // Draw card ID
        ctx.font = '16px Arial';
        ctx.fillText(cardId, canvas.width / 2, canvas.height - 20);
        
        // Draw special mechanic if any
        if (card.specialMechanic) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 22px Arial';
            ctx.fillText(card.specialMechanic, canvas.width / 2, 160);
        }
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // In a real implementation, you would save this image to the assets directory
        // For this demo, we'll just update the card's img property to use a placeholder URL
        card.img = `https://via.placeholder.com/400x560/${bgColor.replace('#', '')}/${card.type.includes('Dark') ? 'ffffff' : '000000'}?text=${card.name}`;
    });
    
    // Create pack image placeholder
    MYTHIC_LEGENDS_SET.packImage = 'https://via.placeholder.com/300x400/483D8B/FFFFFF?text=Mythic+Legends+Pack';
}

// Export functions for use in main game
window.mythicLegendsSet = {
    initializeMythicLegendsSet,
    updateSetRotationValues,
    generateMythicLegendsPack,
    createMythicLegendsPlaceholderImages,
    MYTHIC_LEGENDS_SET,
    MYTHIC_LEGENDS_CARDS
};