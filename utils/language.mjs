const LANGUAGES = {
    ENGLISH: 'en',
    NORWEGIAN: 'no'
};

const translations = {
    [LANGUAGES.ENGLISH]: {
        MENU_START_GAME: "Start Game",
        MENU_LANGUAGE: "Language",
        MENU_EXIT: "Exit Game",
        
        SHIP_PLACEMENT_TITLE: "Ship Placement",
        SHIP_PLACEMENT_HEADER: "Ship Placement Phase",
        SHIP_PLACEMENT_PLAYER1: "First player get ready.\nPlayer two look away",
        SHIP_PLACEMENT_PLAYER2: "Second player get ready.\nPlayer one look away",
        
        CONTROLS_TITLE: "Controls",
        CONTROLS_ARROWS: "Arrow keys: Move cursor",
        CONTROLS_ROTATE: "R: Rotate ship",
        CONTROLS_ENTER: "Enter: Place ship",
        CONTROLS_SHIPS_TO_PLACE: "Ships to place",
        
        SHIP_CARRIER: "Carrier",
        SHIP_BATTLESHIP: "Battleship",
        SHIP_CRUISER: "Cruiser",
        SHIP_SUBMARINE: "Submarine",
        SHIP_DESTROYER: "Destroyer",
        
        RESOLUTION_WARNING: "Terminal Size Warning",
        RESOLUTION_TOO_SMALL: "Your terminal window is too small to display the game properly.",
        RESOLUTION_CURRENT_SIZE: "Current size:",
        RESOLUTION_WIDTH: "Width",
        RESOLUTION_HEIGHT: "Height",
        RESOLUTION_MINIMUM: "minimum",
        RESOLUTION_WAITING: "Please resize your terminal window to continue...",
        
        BATTLE_YOUR_BOARD: "Your Board",
        BATTLE_ENEMY_BOARD: "Enemy Board",
        BATTLE_HIT: "Hit!",
        BATTLE_MISS: "Miss!"
    },
    [LANGUAGES.NORWEGIAN]: {
        MENU_START_GAME: "Start Spill",
        MENU_LANGUAGE: "Språk",
        MENU_EXIT: "Avslutt Spill",
        
        SHIP_PLACEMENT_TITLE: "Plasser Skip",
        SHIP_PLACEMENT_HEADER: "Skipplasseringsfase",
        SHIP_PLACEMENT_PLAYER1: "Første spiller gjør deg klar.\nSpiller to se bort",
        SHIP_PLACEMENT_PLAYER2: "Andre spiller gjør deg klar.\nSpiller én se bort",
        
        CONTROLS_TITLE: "Kontroller",
        CONTROLS_ARROWS: "Piltaster: Flytt markør",
        CONTROLS_ROTATE: "R: Roter skip",
        CONTROLS_ENTER: "Enter: Plasser skip",
        CONTROLS_SHIPS_TO_PLACE: "Skip å plassere",
        
        SHIP_CARRIER: "Hangarskip",
        SHIP_BATTLESHIP: "Slagskip",
        SHIP_CRUISER: "Krysser",
        SHIP_SUBMARINE: "Ubåt",
        SHIP_DESTROYER: "Jager",
        
        RESOLUTION_WARNING: "Terminalstørrelse Advarsel",
        RESOLUTION_TOO_SMALL: "Terminalvinduet ditt er for lite til å vise spillet riktig.",
        RESOLUTION_CURRENT_SIZE: "Nåværende størrelse:",
        RESOLUTION_WIDTH: "Bredde",
        RESOLUTION_HEIGHT: "Høyde",
        RESOLUTION_MINIMUM: "minimum",
        RESOLUTION_WAITING: "Vennligst endre størrelse på terminalvinduet for å fortsette...",
        
        BATTLE_YOUR_BOARD: "Ditt Brett",
        BATTLE_ENEMY_BOARD: "Fiendens Brett",
        BATTLE_HIT: "Treff!",
        BATTLE_MISS: "Bom!"
    }
};

let currentLanguage = LANGUAGES.ENGLISH;

function getCurrentLanguage() {
    return currentLanguage;
}

function setLanguage(language) {
    if (translations[language]) {
        currentLanguage = language;
        return true;
    }
    return false;
}

function getText(key) {
    return translations[currentLanguage][key] || translations[LANGUAGES.ENGLISH][key] || key;
}

function getAvailableLanguages() {
    return [
        { code: LANGUAGES.ENGLISH, name: "English" },
        { code: LANGUAGES.NORWEGIAN, name: "Norsk" }
    ];
}

export {
    LANGUAGES,
    getCurrentLanguage,
    setLanguage,
    getText,
    getAvailableLanguages
};