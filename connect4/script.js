var board;
class Checkers extends Board {
    constructor(board, n) {
        super(board);
        this.turn = -1;
        this.n = n;
    }

    fillSquare(row, col) {
        return "";
    }

    checkWin() {
        let row = this.board.length
        let col = this.board[0].length;
        // Check vertical
        for (let r = 0; r < row - this.n + 1; r++)
            for (let c = 0; c < col; c++) {
                let count = 0;
                for(let i = 0; i < this.n; i++) {
                    if(this.board[r][c] != 0 && this.board[r+i][c] == this.board[r][c]) {
                        count++;
                        if(count == this.n) return true;
                    }
                }
            }

        //check horizontal
        for (let r = 0; r < row; r++)
            for (let c = 0; c < col - this.n + 1; c++) {
                let count = 0;
                for(let i = 0; i < this.n; i++) {
                    if(this.board[r][c] != 0 && this.board[r][c+i] == this.board[r][c]) {
                        count++;
                        if(count == this.n) return true;
                    }
                }
            }

        //check right diag
        for (let r = 0; r < row - this.n + 1; r++)
            for (let c = 0; c < col - this.n + 1; c++) {
                let count = 0;
                for(let i = 0; i < this.n; i++) {
                    if(this.board[r][c] != 0 && this.board[r+i][c+i] == this.board[r][c]) {
                        count++;
                        if(count == this.n) return true;
                    }
                }
            }
        
         //check left diag
        for (let r = row - this.n + 1; r < row; r++) {
            for (let c = 0; c < col - this.n + 1; c++) {
                let count = 0;
                for(let i = 0; i < this.n; i++) {
                    if(this.board[r][c] != 0 && this.board[r-i][c+i] == this.board[r][c]) {
                        count++;
                        if(count == this.n) return true;
                    }
                }
            }
        }   
        return false;
    }

    selectPiece(row, col) {
        //if the row is full
        let loc = 0;
        if(this.board[0][col]) return;

        let rows = this.board.length
        //if the row is empty
        if(!this.board[rows-1][col]) {
            row = rows-1;
        }
        //if the row has some stuff
        else {
            for(let i = 0; i < rows; i++) {
                if(this.board[i][col]) {
                    row = i-1;
                    break;
                }
            }
        }

        this.board[row][col] = this.turn;
        $(`#tile-row-${row}-col-${col}`).html(this.tile(this.turn)).after(()=> {
            setTimeout(() => {
                $(".animate").removeClass("animate");
            }, 0);
        });

        if(this.checkWin()) {
            alert((this.turn > 0 ? "YELLOW" : "RED") + " has won");
        }

        this.turn = -this.turn;
        var color = this.turn == -1 ? "red" : "yellow";
        $(".player, .drop").css("color", color);  
    }

    tile(player) {
        var color = player == -1 ? "red" : "yellow";
        return `<i style=color:${color} class="fa fa-circle animate"></i>`
    }

    drawBoard() {
        super.drawBoard();
        let html;
        for(let i = 0; i < this.board[0].length; i++) 
            html += `<td class="drop" onclick="board.selectPiece(0,${i})"><i class="fa fa-circle"><i></td>`
        $("#board").prepend("<tr>"+html+"</tr>")
    }
}

function updateBoard() {
    rows = $("#rows")[0].value;
    cols = $("#cols")[0].value;
    n = $("#n")[0].value;
    let grid = Array(Number(rows)).fill().map(() => Array(Number(cols)).fill(0));
    board = new Checkers(grid, n);
    board.drawBoard();
}

window.onload = () => {
    let grid = Array(6).fill().map(() => Array(7).fill(0));
    board = new Checkers(grid, 4);
    board.drawBoard();
}