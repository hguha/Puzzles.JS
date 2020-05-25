var board;
class Chess extends Board {
    constructor(board) {
        super(board);
        this.turn = "w";
        this.curLoc = "";
        this.pieceMapping = {
            "P": "chess-pawn",
            "Q": "chess-queen",
            "N": "chess-knight",
            "K": "chess-king",
            "R": "chess-rook",
            "B": "chess-bishop",
        }
        this.canCastle = {"w": true, "b": true }
    }

    fillSquare(row, col) {
        var piece = this.board[row][col];
        if(!piece) return "";
        var color = piece[0] == "w" ? "white" : "black";
        return `<i style=color:${color} class="fa fa-${this.pieceMapping[piece[1]]}"></i>`
    }

    checkLegal(piece, x, y) {

        function across(x, y, board, which) {
            //if which is d for diagonal, use the diagonal spacing, otherwise use lateral spacing
            let put = which == "d" ? [[1,1], [1,-1], [-1, 1], [-1, -1]] : [[1,0], [0,-1], [-1, 0], [0, 1]];
            let possible = []
            //iterate throgh the four directions
            for(let k = 0; k < 4; k++) {
                //go until you hit the edge of the board for a piece is in your way
                for(let i = 1; i < 8; i++) {
                    let a = i*put[k][0], b = i*put[k][1];
                    if(y+b > 7  || y+b < 0 || x+a > 7 || x+a < 0) break;
                    if(!board[x+a][y+b]) {
                        possible.push([x+a, y+b])
                    }
                    else {
                        possible.push([x+a, y+b])
                        break;
                    }
                }
            }
            return possible;
        }

        function checkCastle(x, y, col, board) {
            let pos = []
            let kpos = col == "w" ? 7 : 0;
            if(x == kpos && y == 4) {
                if (board[kpos][0][1] == "R" && !board[kpos][1] && !board[kpos][2] && !board[kpos][3]) pos.push([kpos, 2])
                if (board[kpos][7][1] == "R" && !board[kpos][6] && !board[kpos][5]) pos.push([kpos, 6])
            }
            return pos;
        }

        let possible = []
        //find possible moves for each piece
        switch(piece[1]) {
            case "P":
                let dir = piece[0] == "w" ? -1 : 1;
                let start = piece[0] == "w" ? 6 : 1;
                let op = piece[0] == "w" ? "b" : "w";
                //move up one
                if(!this.board[x+dir][y]) possible.push([x+dir, y])
                //move up to if at start
                if(x == start && !this.board[start + dir][y] && !this.board[start + (dir*2)][y]) {
                    possible.push([start + (dir*2), y])
                }
                //check the forward diagonals for opposite color pieces
                if(this.board[x-1][y+1].startsWith(op)) {
                    possible.push([x+dir, y+1])
                }
                if(this.board[x+dir][y-1].startsWith(op)) {
                    possible.push([x+dir, y-1])
                }
                break;
            case "Q":
                possible = across(x, y, this.board, "d")
                possible = possible.concat(across(x, y, this.board, "l"));
                break;
    
            case "N":
                possible = [[x+2, y+1], [x+2, y-1] ,[x+1, y+2], [x+1, y-2],[x-2, y-1], [x-2, y+1],[x-1, y+2], [x-1, y-2]];
                break;
            case "B": possible = across(x, y, this.board, "d"); break;
            case "R": possible = across(x, y, this.board, "l"); break;
            case "K":
                possible = [[x+1, y], [x+1, y+1] , [x+1, y-1], [x, y-1], [x, y+1], [x-1, y], [x-1, y+1], [x-1, y-1]].concat(checkCastle(x, y, piece[0], this.board));
                break;
        } //end switch statement
        return possible;
    }

    selectPiece(row, col) {
        //select initial piece
        if(!this.curLoc && this.board[row][col][0] === this.turn) {
            this.curLoc = [row, col];
            let piece = this.board[row][col];
            let possibles = this.checkLegal(piece, row, col);
            if(possibles) {
                for(let i = 0; i < possibles.length; i++) {
                    if(this.inRange(possibles[i][0], possibles[i][1]) && this.board[possibles[i][0]][possibles[i][1]][0] != this.turn ) {
                        document.getElementById(`tile-row-${possibles[i][0]}-col-${possibles[i][1]}`).style.background = "yellow";
                    }
                }
                //no possible moves
                if(!$(".tile[style]").length) {
                    this.curLoc = "";
                    possibles = [];
                }
            }
        }
    
        if(this.curLoc && this.board[row][col][0] !== this.turn) {
            if(!$(`#tile-row-${row}-col-${col}[style]`).length) {
                this.curLoc = "";
                $(".tile[style]").removeAttr("style");
                return;
            }

            //castling logic
            if(this.board[this.curLoc[0]][this.curLoc[1]][1] == "K") this.canCastle[this.turn] == false;
            if(this.board[this.curLoc[0]][this.curLoc[1]][1] == "K" && this.canCastle[this.turn] && (col == 2 || col == 6)) {
                let kpos = this.turn == "w" ? 7 : 0,
                ropos = col == 2 ? 0 : 7,
                rnpos = col == 2 ? 3 : 5,
                rook = this.fillSquare(kpos, 0);
                $(`#tile-row-${kpos}-col-${rnpos}`).html(rook);
                $(`#tile-row-${kpos}-col-${ropos}`).html("");
                this.board[kpos][rnpos] = this.turn+"R"
                this.board[kpos][ropos] = "";
                this.canCastle[this.turn] = false;
            }
            
            //change the DOM
            let piece = this.fillSquare(this.curLoc[0],this.curLoc[1]);
            $(`#tile-row-${row}-col-${col}`).html(piece);
            $(`#tile-row-${this.curLoc[0]}-col-${this.curLoc[1]}`).html("");
    
            //change interal board
            this.board[row][col] = this.board[this.curLoc[0]][this.curLoc[1]];
            this.board[this.curLoc[0]][this.curLoc[1]] = "";
            this.turn = this.turn == "w" ? "b" : "w";
            this.curLoc = "";
            
            //clear the coloring
            $(".tile[style]").removeAttr("style");
        }
    }
}


window.onload = () => {
    let grid = [
                ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
                ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
                [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ],
                [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ],
                [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ],
                [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ],
                ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
                ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
            ]
    board = new Chess(grid);
    board.drawBoard();
}