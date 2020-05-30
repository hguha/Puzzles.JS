var board;
var COMP = 1, HUMAN = -1;

class TicTacToe extends Board {
    constructor(board) {
        super(board);
        this.selected;
        this.ai = false;
        this.turn = -1;
    }
    
    selectPiece(row, col) {
        //Player 1 move
        if(this.board[row][col]) return;
        $(`#tile-row-${row}-col-${col}`).html(this.turn == -1 ? "X" : "O");
        this.board[row][col] = this.turn;
        this.count++;
        if(this.count == 9) alert("it's a draw")
        
        //ai move
        if(this.ai) {
            let move = this.minimax(this.board, this.empty(this.board).length, COMP);
            this.board[move[0]][move[1]] = 1;
            $(`#tile-row-${move[0]}-col-${move[1]}`).html("O");
            this.count++;
            if(this.gameOver(this.board, COMP)) alert("Computer has won!");
        }
        else {
            this.turn = -this.turn;
        }
        $("#messages").html(`Player ${this.turn > 0 ? 2 : 1}'s Turn`)
    }

    gameOver(state, player) {
        var win_state = [
            [state[0][0], state[0][1], state[0][2]],
            [state[1][0], state[1][1], state[1][2]],
            [state[2][0], state[2][1], state[2][2]],
            [state[0][0], state[1][0], state[2][0]],
            [state[0][1], state[1][1], state[2][1]],
            [state[0][2], state[1][2], state[2][2]],
            [state[0][0], state[1][1], state[2][2]],
            [state[2][0], state[1][1], state[0][2]],
        ];
    
        for (var i = 0; i < win_state.length; i++) {
            var line = win_state[i];
            var filled = 0;
            for (var j = 0; j < 3; j++) {
                if (line[j] == player)
                    filled++;
            }
            if (filled == 3)
                return true;
        }
        return false;
    }

    empty(board) {
        var cells = [];
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                if (!board[x][y]) cells.push([x, y]);
            }
        }
        return cells;
    }

    minimax(state, depth, player) {
        var best, self = this;
        if (player == COMP)  best = [-1, -1, -1000];
        else best = [-1, -1, 1000];
    
        if (depth == 0  || this.gameOver(state, HUMAN) || this.gameOver(state, COMP)) {
            var score = 0;
            if (this.gameOver(state, COMP)) score = 1;
            if (this.gameOver(state, HUMAN)) score = -1;
            return [-1, -1, score];
        }
    
        this.empty(state).forEach(function(cell) {
            var x = cell[0];
            var y = cell[1];
            state[x][y] = player;
            var score = self.minimax(state, depth-1, -player);
            state[x][y] = 0;
            score[0] = x;
            score[1] = y;
            if (player == COMP && score[2] > best[2]) best = score;
            else if(player == HUMAN && score[2] < best[2]) best = score;
        });
    
        return best;
    }

}

function players(num) {
    $(".chosen").removeClass("chosen");
    if(num == 1) {
        board.ai = true;
        $("#one").addClass("chosen");
    }
    else {
        board.ai = false;
        $("#two").addClass("chosen");
    }

    board.clear();
    board.turn = -1;
}

window.onload = () => {
    grid = Array(3).fill().map(() => Array(3).fill(0));
    board = new TicTacToe(grid);
    board.drawBoard();
}