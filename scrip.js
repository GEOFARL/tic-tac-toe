const startGamePlVsPlBtn = document.querySelector('.pvsp');
const beginGameBtn = document.querySelector('.new-game-container button');

startGamePlVsPlBtn.addEventListener('click', () => {
    const loadingWindow = document.querySelector('.loading-window');
    loadingWindow.style.display = 'none';
    const pvspWindow = document.querySelector('.player-vs-player-window');
    pvspWindow.style.display = 'grid';
})
startGamePlVsPlBtn.addEventListener('touch', () => {
    const loadingWindow = document.querySelector('.loading-window');
    loadingWindow.style.display = 'none';
    const pvspWindow = document.querySelector('.player-vs-player-window');
    pvspWindow.style.display = 'grid';
})

let secureGame = (function() {
    const playBoard = (() => {
        let board = initializeBoard();
        function initializeBoard() {
            let matrix = [];
            for (row = 0; row < 3; row++) {
                let array = [];
                for (column = 0; column < 3; column++) {
                    array.push(0);
                }
                matrix.push(array);
            }
            return matrix;
        }
        function isPositionFree(row, col) {
            if (board[row][col] !== 'X' && board[row][col] !== 'O') return true;
            return false;
        }
        change = function(row, col, mark) {
            board[row][col] = mark;
        }
        let winner = 'tie';
        function isGameOver() {
            let xMainDiagCounter = 0;
            let xSecondDiagCounter = 0;
            let oMainDiagCounter = 0;
            let oSecondDiagCounter = 0;
            for (let row = 0; row < 3; row++) {
                let xRowCounter = 0;
                let xColCounter = 0;
                let oRowCounter = 0;
                let oColCounter = 0;
                for (let col = 0; col < 3; col++) {
                    if (board[row][col] === 'X') xRowCounter++;
                    else if (board[row][col] === 'O') oRowCounter++;
                    if (board[col][row] === 'X') xColCounter++;
                    else if (board[col][row] === 'O') oColCounter++;
    
                    if (row === col) {
                        if (board[row][row] === 'X') xMainDiagCounter++;
                        else if (board[row][row] === 'O') oMainDiagCounter++;
                    }
                    if (row + col === 2) {
                        if (board[row][col] === 'X') xSecondDiagCounter++;
                        else if (board[row][col] === 'O') oSecondDiagCounter++;
                    }
                }
                if (xRowCounter === 3 || xColCounter === 3) {
                    winner = 'player1';
                    return true;
                }
                else if (oRowCounter === 3 || oColCounter === 3) {
                    winner = 'player2';
                    return true;
                }
            }
            if (xMainDiagCounter === 3 || xSecondDiagCounter === 3) {
                winner = 'player1';
                return true;
            }
            else if (oMainDiagCounter === 3 || oSecondDiagCounter === 3) {
                winner = 'player2';
                return true;
            }
            return false;
        }
        function getWinner() {
            return winner;
        }
        function cleanBoard() {
            [...document.querySelectorAll('.field-container div')].forEach((section) => {
                section.innerHTML = '';
            });
            board = initializeBoard();
        }
        return {change, isPositionFree, isGameOver, getWinner, cleanBoard};
    })();
    
    const Player = function(order) {
        let name, mark, markForTable;
        if (order === 1) {
            name = document.querySelector('#player1').value;
            mark = '<svg style="width: 80%; height: 80%" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z"/></svg>';
            markForTable = 'X'
        }
        else if (order === 2) {
            name = document.querySelector('#player2').value;
            mark = '<svg style="width: 80%; height: 80%" viewBox="0 0 24 24"><path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>';
            markForTable = 'O';
        }
        let move = function(e) {
            let numberOfCell = e.target.getAttribute('data-key');
            let row = Math.ceil(numberOfCell / 3) - 1;
            let col = (numberOfCell - row * 3) - 1;
            if (playBoard.isPositionFree(row, col)) {
                e.target.innerHTML = mark;
            }
            playBoard.change(row, col, markForTable);
        }
        function getName() {
            return name;
        }
        return {move, getName};
    }
    
    const game = (() => {
        let players, moveCount;
        beginGameBtn.addEventListener('click', initializeGame);
        beginGameBtn.addEventListener('touch', initializeGame);
        function initializeGame() {
            const pattern = /^[A-Za-z_.\-0-9]{3,20}$/;
            if (pattern.test(document.querySelector('#player1').value) && pattern.test(document.querySelector('#player2').value)) {
                const newGameBtn = document.querySelector('.new-game-container');
                const pvspWindow = document.querySelector('.player-vs-player-window');
                const inputFields = pvspWindow.querySelector('.players-container');
                inputFields.style.display = 'none';
                const grid = pvspWindow.querySelector('.field-container');
                newGameBtn.style.display = 'none';
                pvspWindow.style["grid-template-rows"] = "1fr";
                pvspWindow.style["place-items"] = 'center';
                grid.style.display = 'grid';
                players = {
                    player1: Player(1),
                    player2: Player(2),
                    tie: {getName: () => "It's a tie!"},
                }
                moveCount = 1;
                [...document.querySelectorAll('.field-container div')].forEach((section) => {
                    section.addEventListener('click', addMark);
                    section.addEventListener('touch', addMark);
                })
                document.querySelector('.turn').style.display = 'block';
                document.querySelector('.player-name').innerText = '';
                document.querySelector('.turn').innerText = `${players.player1.getName().capitalize()}'s turn`;
            }
        }
        function addMark(e) {
            if (moveCount % 2 === 1) {
                players.player1.move(e);
                moveCount++;
                document.querySelector('.turn').innerText = `${players.player2.getName().capitalize()}'s turn`;
            }
            else {
                players.player2.move(e);
                moveCount++;
                document.querySelector('.turn').innerText = `${players.player1.getName().capitalize()}'s turn`;
            }
            if (playBoard.isGameOver() || moveCount === 10) {
                if (moveCount === 10 && playBoard.getWinner() === 'tie') {
                    document.querySelector('.player-name').innerText = players[playBoard.getWinner()].getName();
                }
                else {
                    document.querySelector('.player-name').innerText = `${players[playBoard.getWinner()].getName().capitalize()} won`;
                }
                moveCount = 1;
                const playerVsPlayerWindow = document.querySelector('.player-vs-player-window');
                const gameOverWindow = document.querySelector('.game-over-window');
                playerVsPlayerWindow.style.display = 'none';
                gameOverWindow.style.display = 'grid';
                const newGameBtn = [...document.querySelectorAll('.new-game-container button')][1];
                function changeDisplay () {
                    gameOverWindow.style.display = 'none';
                    playerVsPlayerWindow.style.display = 'grid';
                    playBoard.cleanBoard();
                    document.querySelector('.turn').innerText = `${players.player1.getName().capitalize()}'s turn`;
                }
                newGameBtn.addEventListener('click', changeDisplay);
                newGameBtn.addEventListener('touch', changeDisplay);
            }
        }
    })();
})();

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});