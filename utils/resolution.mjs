import { getText } from "./language.mjs";

const MIN_TERMINAL_WIDTH = 80;
const MIN_TERMINAL_HEIGHT = 24;

function getTerminalSize() {
    return {
        width: process.stdout.columns,
        height: process.stdout.rows
    };
}

function meetsMinimumRequirements() {
    const { width, height } = getTerminalSize();
    return width >= MIN_TERMINAL_WIDTH && height >= MIN_TERMINAL_HEIGHT;
}

function showResolutionPrompt() {
    const { width, height } = getTerminalSize();
    const output = [
        `\x1b[31m\x1b[1m⚠ ${getText('RESOLUTION_WARNING')} ⚠\x1b[0m`,
        "",
        getText('RESOLUTION_TOO_SMALL'),
        "",
        getText('RESOLUTION_CURRENT_SIZE'),
        `${getText('RESOLUTION_WIDTH')}: ${width} ${getText('RESOLUTION_COLUMNS')} (${getText('RESOLUTION_MINIMUM')}: ${MIN_TERMINAL_WIDTH})`,
        `${getText('RESOLUTION_HEIGHT')}: ${height} ${getText('RESOLUTION_ROWS')} (${getText('RESOLUTION_MINIMUM')}: ${MIN_TERMINAL_HEIGHT})`,
        "",
        getText('RESOLUTION_WAITING'),
        "",
        getText('RESOLUTION_LIVE_UPDATE')
    ].join("\n");

    console.clear();
    const startRow = Math.floor((height - 11) / 2);
    const startCol = Math.floor((width - 60) / 2); 


    process.stdout.write(`\x1b[${startRow};${startCol}H${output}`);

    return new Promise((resolve) => {
        function checkSize() {
            if (meetsMinimumRequirements()) {
                resolve();
            } else {
                const { width, height } = getTerminalSize();
                const sizeRow = startRow + 5;
                process.stdout.write(`\x1b[${sizeRow};${startCol}H${getText('RESOLUTION_WIDTH')}: ${width} ${getText('RESOLUTION_COLUMNS')} (${getText('RESOLUTION_MINIMUM')}: ${MIN_TERMINAL_WIDTH})     `);
                process.stdout.write(`\x1b[${sizeRow + 1};${startCol}H${getText('RESOLUTION_HEIGHT')}: ${height} ${getText('RESOLUTION_ROWS')} (${getText('RESOLUTION_MINIMUM')}: ${MIN_TERMINAL_HEIGHT})     `);
                setTimeout(checkSize, 100);
            }
        }
        
        process.stdout.on('resize', checkSize);
        checkSize();
    });
}

export { 
    getTerminalSize, 
    meetsMinimumRequirements, 
    showResolutionPrompt,
    MIN_TERMINAL_WIDTH,
    MIN_TERMINAL_HEIGHT
};