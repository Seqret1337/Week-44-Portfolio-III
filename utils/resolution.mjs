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
        "\x1b[31m\x1b[1m⚠ Terminal Size Warning ⚠\x1b[0m",
        "",
        "Your terminal window is too small to display the game properly.",
        "",
        "Current size:",
        `Width: ${width} columns (minimum: ${MIN_TERMINAL_WIDTH})`,
        `Height: ${height} rows (minimum: ${MIN_TERMINAL_HEIGHT})`,
        "",
        "Please resize your terminal window to continue...",
        "",
        "\x1b[33mWaiting for correct size...\x1b[0m"
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
                process.stdout.write(`\x1b[${startRow + 5};${startCol}HWidth: ${width} columns (minimum: ${MIN_TERMINAL_WIDTH})`);
                process.stdout.write(`\x1b[${startRow + 6};${startCol}HHeight: ${height} rows (minimum: ${MIN_TERMINAL_HEIGHT})`);
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