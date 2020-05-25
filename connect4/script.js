var board;
class Checkers extends Board {
    constructor(board) {
        super(board);
        this.turn = -1;
    }

    fillSquare(row, col) {
        return "";
    }

    checkWin(board, player) {
        function chkLine(a,b,c,d,player) {
            return ((a !== 0) && (a ==b) && (a == c) && (a == d));
        }

        // Check vertical
        for (let r = 0; r < 3; r++)
            for (let c = 0; c < 7; c++)
                if (chkLine(board[r][c], board[r+1][c], board[r+2][c], board[r+3][c], player))
                    return true;
    
        // Check horizontal
        for (let r = 0; r < 6; r++)
            for (let c = 0; c < 4; c++)
                if (chkLine(board[r][c], board[r][c+1], board[r][c+2], board[r][c+3], player))
                    return true;
    
        // Check right diag
        for (let r = 0; r < 3; r++)
            for (let c = 0; c < 4; c++)
                if (chkLine(board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3], player))
                    return true;
    
        // Check left diag
        for (let r = 3; r < 6; r++)
            for (let c = 0; c < 4; c++)
                if (chkLine(board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3], player))
                    return true;

        return false;
    }

    selectPiece(row, col) {
        //if the row is full
        let loc = 0;
        if(this.board[0][col]) return;

        //if the row is empty
        if(!this.board[5][col]) {
            row = 5;
        }
        //if the row has some stuff
        else {
            for(let i = 0; i <6; i++) {
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

        if(this.checkWin(this.board, this.turn)) {
            console.log(this.turn, "won");
        }
        this.turn = -this.turn;
    }

    tile(player) {
        var color = player == -1 ? "red" : "yellow";
        return `<i style=color:${color} class="fa fa-circle animate"></i>`
    }
}


window.onload = () => {
    let grid = Array(6).fill().map(() => Array(7).fill(0));
    board = new Checkers(grid);
    board.drawBoard();
}