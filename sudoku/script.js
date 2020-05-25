//globally, the board that's drawn the screen
var board;

class Sudoku extends Board {
    constructor(board) {
        super(board);
        this.board = board;
        this.selected;
        this.selectedLoc;
    }
    
    check() {
        //check rows and cols
        var row, col, box
        for (let i = 0; i < 9; i++) {
            row = []; col = [];
            for (let j = 0; j < 9; j++) {
                //check rows
                if (this.board[i][j] && !row.includes(this.board[i][j])) { row.push(this.board[i][j]); }
                else { return false; } //returns false if there are any blanks, or any duplicates
    
                //check cols
                if (this.board[j][i] && !col.includes(this.board[j][i])) { col.push(this.board[j][i]); }
                else { return false; }
            }
        }
    
        //check squares
        //go through all 9 3x3's
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 9; j += 3) {
                box = []
                //each 3x3 handled:
                for (let k = i; k < i + 3; k++) {
                    for (let l = j; l < j + 3; l++) {
                        if (this.board[k][l] && !box.includes(this.board[k][l])) { box.push(this.board[k][l]); }
                        else { return false; }
                    }
                }
            }
        }
        return true;
    }

    isValid(row, col, k) {
        for (let i = 0; i < 9; i++) {
            const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const n = 3 * Math.floor(col / 3) + i % 3;
            if (this.board[row][i] == k || this.board[i][col] == k || this.board[m][n] == k) {
                return false;
            }
        }
        return true;
    }
    
    async solve(show = true) {
        if(check()) return;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] == 0) {
                    for (let k = 1; k <= 9; k++) {
                        if (this.isValid(i, j, k)) {
                            this.board[i][j] = k;
                            if(show) {
                                $(`#tile-row-${i}-col-${j}`).html(k);
                                $(".tile[style]").removeAttr("style");
                                $(`#tile-row-${i}-col-${j}`)[0].style.background = "green";
                                await sleep(50);
                            }
                            if (await this.solve(show)) {
                                return true;
                            } 
                            else {
                                this.board[i][j] = 0;
    
                            }
                        }
                    }
                    return false;
                    
                }
            }
        }
        return true;
    }

    //solves the board, but without the visualization, Much faster.
    fill() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] == 0) {
                    for (let k = 1; k <= 9; k++) {
                        if (this.isValid(i, j, k)) {
                            this.board[i][j] = k;
                            if (this.fill()) {
                                return true;
                            } 
                            else {
                                this.board[i][j] = 0;
    
                            }
                        }
                    }
                    return false;
                    
                }
            }
        }
        return true;
    }
    
    selectNum(row, col) {
        var pressed = Number($(`#pad-row-${row}-col-${col}`).html())
        if (this.selected) {
            this.board[this.selectedLoc[0]][this.selectedLoc[1]] = pressed;
            this.selected.innerHTML = pressed;
        }
    }
    
    clearSquare() {
        if (this.selected) {
            this.selected.innerHTML = " ";
            this.board[this.selectedLoc[0]][this.selectedLoc[1]] = 0;
        }
    }


    generate() {
        this.fill(); //fill in the array based on a little
        for (let i = 0; i < 9; i ++) {
            for (let j = 0; j < 9; j ++) {
                if(Math.random() < 0.6) {
                    this.board[i][j] = 0; //clear some squares
                }
            }
        }
    }
}

function sleep(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
}

function initKeypad() {
    keypad = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ];
    for (let i = 0; i < 3; i++) {
        var row = "<tr id='pad-row-" + i + "'></tr>";
        $("#keypad").append(row);
        for (let j = 0; j < 3; j++) {
            num = keypad[i][j] ? keypad[i][j] : " "
            var col = "<td onclick='board.selectNum(" + i + "," + j + ")' class='tile' id='pad-row-" + i + "-col-" + j + "'>" + num + "</tr>";
            $(`#pad-row-${i}`).append(col);
        }
    }
}

function check() {
    if(board.check()) {
        $("#messages").html("SOLVED!") 
    }
    else {
        $("#messages").html("NOT SOLVED!") 
    }
}

Array.prototype.shuffle = function () {
    var arr = this.valueOf();
    var ret = [];
    while (ret.length < arr.length) {
       var x = arr[Math.floor(Number(Math.random() * arr.length))];
       if (!(ret.indexOf(x) >= 0)) ret.push(x);
    }
    return ret;
}

function generate() {
    var sudoku_array = [1,2,3,4,5,6,7,8,9];
    let array = Array(9).fill().map(() => Array(9).fill(0));
    array[0] = sudoku_array.shuffle();
    gen = new Sudoku(array);
    gen.generate();
    board = gen;
    board.drawBoard();
}



window.onload = () => {
    let grid = Array(9).fill().map(() => Array(9).fill(0));
    board = new Sudoku(grid);
    board.drawBoard();
    initKeypad();

    //handle key input for currently drawn board
    document.addEventListener('keydown', (event) => {
        if (board.selected) {
            //arrow keys
            if (event.keyCode >= 37 && event.keyCode <= 40) {
                switch (event.keyCode) {
                    case 37: board.selectedLoc[1] == 0 ? null : board.selectedLoc[1]--; break; //left
                    case 38: board.selectedLoc[0] == 0 ? null : board.selectedLoc[0]--; break; //up
                    case 39: board.selectedLoc[1] == 8 ? null : board.selectedLoc[1]++; break; //right
                    case 40: board.selectedLoc[0] == 8 ? null : board.selectedLoc[0]++; break; //down
                }
                $(".tile[style]").removeAttr("style");
                board.selectPiece(board.selectedLoc[0], board.selectedLoc[1]);
            }

            //if the key is between 1 and 9, inclusive
            if (event.keyCode >= 49 && event.keyCode <= 57) {
                board.selected.innerHTML = Number(event.key);
                board.board[board.selectedLoc[0]][board.selectedLoc[1]] = Number(event.key);
            }

            //if the key is backspace
            if (event.keyCode == 8) {
                board.clearSquare();
            }
        }
    });
}