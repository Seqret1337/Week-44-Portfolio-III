import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInnBetweenScreen from "./game/innbetweenScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";
import { meetsMinimumRequirements, showResolutionPrompt } from "./utils/resolution.mjs";
import { getText, getAvailableLanguages, setLanguage } from "./utils/language.mjs";

const MAIN_MENU_ITEMS = buildMenu();

const GAME_FPS = 1000 / 60;
let currentState = null;
let gameLoop = null;

let mainMenuScene = null;
let isResolutionPromptActive = false;

async function initialize() {
    if (!meetsMinimumRequirements()) {
        isResolutionPromptActive = true;
        await showResolutionPrompt();
        isResolutionPromptActive = false;
    }

    print(ANSI.HIDE_CURSOR);
    clearScreen();
    mainMenuScene = createMenu(MAIN_MENU_ITEMS);
    SplashScreen.next = mainMenuScene;
    currentState = SplashScreen;
    gameLoop = setInterval(update, GAME_FPS);

    process.stdout.on('resize', async () => {
        if (!meetsMinimumRequirements() && !isResolutionPromptActive) {
            clearInterval(gameLoop);
            isResolutionPromptActive = true;
            
            await showResolutionPrompt();
            isResolutionPromptActive = false;
            
            clearScreen();
            currentState.isDrawn = false;
            gameLoop = setInterval(update, GAME_FPS);
        } else if (meetsMinimumRequirements()) {
            currentState.isDrawn = false;
        }
    });
}

function update() {
    if (!isResolutionPromptActive) {
        currentState.update(GAME_FPS);
        currentState.draw(GAME_FPS);
        if (currentState.transitionTo != null) {
            clearScreen();
            currentState = currentState.next;
            currentState.isDrawn = false;
        }
    }
}

initialize().catch(console.error);

function buildMenu() {
    let menuItemCount = 0;
    return [
        {
            text: getText('MENU_START_GAME'), 
            id: menuItemCount++, 
            action: function () {
                clearScreen();
                let innbetween = createInnBetweenScreen();
                innbetween.init(getText('SHIP_PLACEMENT_PLAYER1'), () => {
                    let p1map = createMapLayoutScreen();
                    p1map.init(FIRST_PLAYER, (player1Board) => {
                        let innbetween = createInnBetweenScreen();
                        innbetween.init(getText('SHIP_PLACEMENT_PLAYER2'), () => {
                            let p2map = createMapLayoutScreen();
                            p2map.init(SECOND_PLAYER, (player2Board) => {
                                let battleScreen = createBattleshipScreen();
                                battleScreen.init(player1Board, player2Board);
                                let innbetween = createInnBetweenScreen();
                                innbetween.init("Player 1's turn begins!", () => {
                                    return battleScreen;
                                }, 3);
                                
                                return innbetween;
                            });
                            return p2map;
                        });
                        return innbetween;
                    });
                    return p1map;
                }, 3);
                currentState.next = innbetween;
                currentState.transitionTo = "Map layout";
            }
        },
        {
            text: getText('MENU_LANGUAGE'),
            id: menuItemCount++,
            action: function() {
                const languageMenu = createMenu(
                    getAvailableLanguages().map((lang, index) => ({
                        text: lang.name,
                        id: index,
                        action: function() {
                            setLanguage(lang.code);
                            mainMenuScene = createMenu(buildMenu());
                            currentState.next = mainMenuScene;
                            currentState.transitionTo = "Main Menu";
                        }
                    }))
                );
                currentState.next = languageMenu;
                currentState.transitionTo = "Language Menu";
            }
        },
        { 
            text: getText('MENU_EXIT'), 
            id: menuItemCount++, 
            action: function () { 
                print(ANSI.SHOW_CURSOR); 
                clearScreen(); 
                process.exit(); 
            } 
        },
    ];
}


