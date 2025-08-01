# Cardboard Capitalist Enhanced Edition V2 - Installation Guide

This guide will help you set up and run the enhanced version 2 of Cardboard Capitalist.

## Installation Steps

1. **Extract the ZIP file**
   Extract all contents of the `enhanced_cardboard_capitalist_v2.zip` file to a folder on your computer.

2. **File Structure**
   Make sure the file structure looks like this:
   ```
   /your-folder/
   ├── index.html                    # Main HTML file for V2 (GitHub Pages entry point)
   ├── improved_styles.css           # Base CSS styles
   ├── improved_card_rendering.js    # Card rendering functionality
   ├── improved_pack_opening.js      # Pack opening functionality
   ├── main_enhanced.js              # Main game logic
   ├── trading_system.js             # Trading system functionality
   ├── trading_styles.css            # Trading system styles
   ├── card_grading.js               # Card grading functionality
   ├── grading_styles.css            # Card grading styles
   ├── mythic_legends_set.js         # Mythic Legends card set
   ├── enhanced_features_integration.js # Integration of new features
   ├── enhanced_ui.css               # Enhanced UI styles
   ├── config.js                     # Game configuration
   ├── README_V2.md                  # Documentation
   ├── INSTALL_V2.md                 # This file
   └── cardboard-capitalist/         # Original assets folder
       └── assets/
           ├── card_back.png
           ├── evolution_chain_bg.png
           ├── frame_standard.png
           ├── frame_fullart.png
           ├── pack_genesis.png
           └── ... (other card images)
   ```

3. **Run a Local Web Server**
   You need to run the game through a web server due to JavaScript module loading restrictions. Here are a few options:

   **Option 1: Using Python (recommended)**
   If you have Python installed, open a command prompt or terminal in the folder containing the extracted files and run:

   For Python 3:
   ```
   python -m http.server 8000
   ```

   For Python 2:
   ```
   python -m SimpleHTTPServer 8000
   ```

   **Option 2: Using Node.js**
   If you have Node.js installed, you can use the `http-server` package:
   ```
   npx http-server
   ```

   **Option 3: Using Visual Studio Code**
   If you use VS Code, you can install the "Live Server" extension and right-click on `index.html` to select "Open with Live Server".

4. **Access the Game**
   Open your web browser and navigate to:
   ```
   http://localhost:8000
   ```
   or
   ```
   http://localhost:8000/index.html
   ```

## New Features Setup

### Trading System
The trading system is automatically initialized when the game starts. You can access it through the "Trading" tab in the navigation menu.

### Card Grading System
The card grading system is automatically initialized when the game starts. You can access it through the "Grading" tab in the navigation menu.

### Mythic Legends Set
The Mythic Legends set is automatically added to the game in Year 2. You'll receive a notification when it becomes available in the store.

## Troubleshooting

- **Images Not Loading**: Make sure the assets folder is in the correct location and that the file paths in the code match your directory structure.
- **JavaScript Errors**: Check the browser console (F12) for any error messages.
- **CORS Issues**: If you see CORS-related errors, make sure you're running the game through a web server as described above, not by directly opening the HTML file.
- **New Features Not Working**: Check the browser console for any initialization errors. Make sure all JavaScript files are properly loaded.

## Game Controls

- **Next Day**: Advances the game by one day
- **Collection**: View your card collection
- **Store**: Buy packs and supplies
- **Market**: View market trends and card values
- **Trading**: Trade with AI collectors
- **Grading**: Submit cards for professional grading
- **Stats**: View your game statistics and achievements

## Advanced Configuration

If you want to modify the game settings, you can edit the following files:

- **config.js**: Contains basic game configuration
- **trading_system.js**: Configure trader personalities and behavior
- **card_grading.js**: Adjust grading scales and services
- **mythic_legends_set.js**: Modify the Mythic Legends card set

## Data Persistence

The game automatically saves your progress to the browser's local storage. If you clear your browser data, your game progress will be lost. In a future update, we plan to add cloud save functionality.

## Performance Optimization

If you experience performance issues with large collections:

1. Try a different browser (Chrome or Firefox recommended)
2. Reduce the number of cards displayed at once by using filters
3. Close other browser tabs and applications
4. If using a laptop, ensure it's plugged in for maximum performance

Enjoy the enhanced Cardboard Capitalist experience!