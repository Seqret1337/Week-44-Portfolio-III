import { GAME_BOARD_DIM, FIRST_PLAYER, SECOND_PLAYER } from "../consts.mjs";
import { print, clearScreen } from "../utils/io.mjs";
import KeyBoardManager from "../utils/io.mjs";
import { ANSI } from "../utils/ansi.mjs";
import { getText } from "../utils/language.mjs";

const createBattleshipScreen = () => {
    let currentPlayer = FIRST_PLAYER;
    let firstPlayerBoard = null;
    let secondPlayerBoard = null;
    let currentBoard = null;
    let opponentBoard = null;
    let cursorX = 0;
    let cursorY = 0;
    let lastHitResult = null;
    let gameOver = false;
    let winner = null;

    function swapPlayer() {
        currentPlayer *= -1;
        if (currentPlayer == FIRST_PLAYER) {
            currentBoard = firstPlayerBoard;
            opponentBoard = secondPlayerBoard;
        } else {
            currentBoard = secondPlayerBoard;
            opponentBoard = firstPlayerBoard;
        }
        cursorX = 0;
        cursorY = 0;
    }

    function isGameOver() {
        function allShipsHit(board) {
            for (let y = 0; y < GAME_BOARD_DIM; y++) {
                for (let x = 0; x < GAME_BOARD_DIM; x++) {
                    if (board.ships[y][x] !== 0 && board.target[y][x] === 0) {
                        return false;
                    }
                }
            }
            return true;
        }

        if (allShipsHit(firstPlayerBoard)) {
            winner = SECOND_PLAYER;
            return true;
        }
        if (allShipsHit(secondPlayerBoard)) {
            winner = FIRST_PLAYER;
            return true;
        }
        return false;
    }

    function drawBoard(board, isOpponent, startX, title) {
        let output = `${ANSI.COLOR.YELLOW}${title}${ANSI.RESET}\n`;

        output += '  ';
        for (let i = 0; i < GAME_BOARD_DIM; i++) {
            output += ` ${String.fromCharCode(65 + i)}`;
        }
        output += '\n';

        for (let y = 0; y < GAME_BOARD_DIM; y++) {
            output += `${String(y + 1).padStart(2, ' ')} `;

            for (let x = 0; x < GAME_BOARD_DIM; x++) {
                const isCurrentCell = cursorX === x && cursorY === y && isOpponent;
                const hasBeenTargeted = board.target[y][x] !== 0;
                const hasShip = board.ships[y][x] !== 0;

                if (isCurrentCell) {
                    output += ANSI.COLOR.YELLOW + '█' + ANSI.RESET + ' ';
                } else if (hasBeenTargeted) {
                    if (hasShip) {
                        output += ANSI.COLOR.RED + '✖' + ANSI.RESET + ' ';
                    } else {
                        output += ANSI.COLOR.BLUE + '○' + ANSI.RESET + ' ';
                    }
                } else if (!isOpponent && hasShip) {
                    output += ANSI.COLOR.GREEN + '■' + ANSI.RESET + ' ';
                } else {
                    output += ANSI.SEA + ' ' + ANSI.RESET + ' ';
                }
            }
            output += `${y + 1}\n`;
        }

        output += '  ';
        for (let i = 0; i < GAME_BOARD_DIM; i++) {
            output += ` ${String.fromCharCode(65 + i)}`;
        }
        output += '\n\n';

        return output;
    }

    function makeMove() {
        if (opponentBoard.target[cursorY][cursorX] !== 0) {
            return false;
        }

        const isHit = opponentBoard.ships[cursorY][cursorX] !== 0;
        opponentBoard.target[cursorY][cursorX] = isHit ? 1 : -1;
        lastHitResult = isHit ? getText('BATTLE_HIT') : getText('BATTLE_MISS');

        if (isGameOver()) {
            gameOver = true;
        } else {
            swapPlayer();
        }

        return true;
    }

    return {
        isDrawn: false,
        next: null,
        transitionTo: null,

        init: function(firstPBoard, secondPBoard) {
            firstPlayerBoard = firstPBoard;
            secondPlayerBoard = secondPBoard;
            currentBoard = firstPlayerBoard;
            opponentBoard = secondPlayerBoard;
        },

        update: function(dt) {
            if (gameOver) return;

            if (KeyBoardManager.isUpPressed()) {
                cursorY = Math.max(0, cursorY - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isDownPressed()) {
                cursorY = Math.min(GAME_BOARD_DIM - 1, cursorY + 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isLeftPressed()) {
                cursorX = Math.max(0, cursorX - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isRightPressed()) {
                cursorX = Math.min(GAME_BOARD_DIM - 1, cursorX + 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isEnterPressed()) {
                if (makeMove()) {
                    this.isDrawn = false;
                }
            }
        },

        draw: function(dr) {
            if (this.isDrawn == false) {
                this.isDrawn = true;
                clearScreen();

                let output = '';
                
                output += `${ANSI.COLOR.YELLOW}${ANSI.TEXT.BOLD}Battleships${ANSI.RESET}\n`;
                output += `${currentPlayer === FIRST_PLAYER ? "Player 1" : "Player 2"}'s turn\n\n`;

                const ownBoard = drawBoard(currentBoard, false, 0, getText('BATTLE_YOUR_BOARD'));
                const enemyBoard = drawBoard(opponentBoard, true, GAME_BOARD_DIM + 5, getText('BATTLE_ENEMY_BOARD'));

                const ownLines = ownBoard.split('\n');
                const enemyLines = enemyBoard.split('\n');
                const maxLines = Math.max(ownLines.length, enemyLines.length);

                for (let i = 0; i < maxLines; i++) {
                    output += (ownLines[i] || '').padEnd(GAME_BOARD_DIM * 3 + 5);
                    output += (enemyLines[i] || '') + '\n';
                }

                if (lastHitResult) {
                    output += `\nLast shot: ${lastHitResult}\n`;
                }

                if (gameOver) {
                    output += `\n${ANSI.COLOR.GREEN}${ANSI.TEXT.BOLD}Game Over! `;
                    output += `${winner === FIRST_PLAYER ? "Player 1" : "Player 2"} wins!${ANSI.RESET}\n`;
                } else {
                    output += `\n${ANSI.TEXT.BOLD}Controls:${ANSI.TEXT.BOLD_OFF}\n`;
                    output += "Arrow keys: Move cursor\n";
                    output += "Enter: Fire at selected position\n";
                }

                print(output);
            }
        }
    };
};

export default createBattleshipScreen;