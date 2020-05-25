var board;
class Checkers extends Board {
    constructor(board) {
        super(board);
        this.turn = "w";
        this.curLoc = "";
        this.possibles = [];
        this.turnEnd = false;
    }

    getDOMPiece(row, col) {
        var piece = this.board[row][col];
        if(!piece) return "";
        var color = piece[0] == "w" ? "white" : "black";
        return `<i style=color:${color} class="fa fa-circle"></i>`
    }

    fillSquare(row, col) {
        var piece = this.board[row][col];
        if(!piece) return "";
        var color = piece[0] == "w" ? "white" : "black";
        return `<i style=color:${color} class="fa fa-circle"></i>`
    }

    checkJumps(x, y, dir, op) {
        let possibles = new Map();

        if(this.inRange(x+(2*dir), y+2)) {
            if(this.board[x+dir][y+1].startsWith(op) && !this.board[x+(2*dir)][y+2]) {
                possibles.set([x+(2*dir), y+2].join(""), [x+dir, y+1]);
            }
        }

        if(this.inRange(x+(2*dir), y-2)) {
            if(this.board[x+dir][y-1].startsWith(op) && !this.board[x+(2*dir)][y-2]) { 
                possibles.set([x+(2*dir), y-2].join(""), [x+dir, y-1]);
            }
        }

        
        return possibles;
    }

    checkLegal(piece, x, y) {
        //free spaces
        let possible = new Map()
        let dir = piece[0] == "w" ? -1 : 1;
        let op = piece[0] == "w" ? "b" : "w";
        let put = [[dir,1], [dir,-1]]
        if(piece[1] == "K") console.log("ADD KING LOGIC YOU IDIOT")

        for(let k = 0; k < 1; k++) {
            if(!this.board[x+dir][y+1]) possible.set([x+dir, y+1].join(""), [])
            if(!this.board[x+dir][y-1]) possible.set([x+dir, y-1].join(""), [])
            possible = new Map([...possible, ...this.checkJumps(x, y, dir, op)])
        }
        return possible;
        //king logic
    }

    choosePiece(row, col) {
        let piece = this.board[row][col];
        this.possibles = this.checkLegal(piece, row, col);
        let posList = [...this.possibles.keys()];
        if(posList) {
            for(let i = 0; i < posList.length; i++) {
                if(this.inRange(posList[i][0], posList[i][1]) && this.board[posList[i][0]][posList[i][1]][0] != this.turn ) {
                    document.getElementById(`tile-row-${posList[i][0]}-col-${posList[i][1]}`).style.background = "cyan";
                }
            }
            //no possible moves
            if(!$(".tile[style]").length) {
                this.curLoc = "";
                this.possibles = [];
            }
        }
    }

    chooseDest(row, col) {
        this.turnEnd = false;
        //clicked outside of possible squares, unselect
        if(!$(`#tile-row-${row}-col-${col}[style]`).length) {
            this.curLoc = "";
            this.possibles = [];
            $(".tile[style]").removeAttr("style");
            return;
        }

        //change the DOM
        let piece = this.getDOMPiece(this.curLoc[0],this.curLoc[1]);
        $(`#tile-row-${row}-col-${col}`).html(piece);
        $(`#tile-row-${this.curLoc[0]}-col-${this.curLoc[1]}`).html("");
        if(this.remove) {
            for(let i = 0; i < this.remove.length; i++) {
                let x = this.remove[i][0], y = this.remove[i][1];
                $(`#tile-row-${x}-col-${y}`).html("");
                this.board[x][y] = "";
            }
        }

        //change internal board
        this.board[row][col] = this.board[this.curLoc[0]][this.curLoc[1]];
        this.board[this.curLoc[0]][this.curLoc[1]] = "";

        //handle captured pieces
        if(this.possibles.get([row, col].join("")).length) {
            let remove = this.possibles.get([row, col].join(""));
            $(`#tile-row-${remove[0]}-col-${remove[1]}`).html("");
            this.board[remove[0]][remove[1]] = "";

            //check for more jumps
            let piece = this.board[row][col];
            let dir = piece[0] == "w" ? -1 : 1;
            let op = piece[0] == "w" ? "b" : "w";
            this.possibles = this.checkJumps(row, col, dir, op);
            this.curLoc = [row, col];
            let posList = [...this.possibles.keys()];
            $(".tile[style]").removeAttr("style");
            console.log("posList", posList);
            if(posList) {
                for(let i = 0; i < posList.length; i++) {
                    if(this.inRange(posList[i][0], posList[i][1]) && this.board[posList[i][0]][posList[i][1]][0] != this.turn ) {
                        console.log("got here");
                        document.getElementById(`tile-row-${posList[i][0]}-col-${posList[i][1]}`).style.background = "cyan";
                    }
                }
                
                //no possible moves
                if(!$(".tile[style]").length) {
                    console.log("h")
                    console.log("got here");
                    this.curLoc = "";
                    this.possibles = [];
                    this.turnEnd = true;
                }
            }
        } 
        else {
            console.log("d")
            this.turnEnd = true;
        }
        
        if(this.turnEnd) {
            $(".tile[style]").removeAttr("style");
            this.curLoc = "";
            this.possibles = [];
            this.turn = this.turn == "w" ? "b" : "w";
            console.log("turn changed to", this.turn);
        }
    }

    selectPiece(row, col) {
        //select initial piece
        if(!this.curLoc && this.board[row][col][0] === this.turn) {
            this.curLoc = [row, col];
            this.choosePiece(row,col);
        }
    
        if(this.curLoc && this.board[row][col][0] !== this.turn) {
            this.chooseDest(row, col);
        }
    }
}


window.onload = () => {
    let grid = [
                ["", "bC", "", "bC", "", "bC", "", "bC"],
                ["bC", "", "bC", "", "bC", "", "bC", ""],
                ["", "bC", "", "bC", "", "bC", "", "bC"],
                [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ],
                [""  , ""  , ""  , ""  , ""  , ""  , ""  , ""  ],
                ["wC", "", "wC", "", "wC", "", "wC",""],
                ["", "wC", "", "wC", "", "wC", "", "wC"],
                ["wC", "", "wC", "", "wC", "", "wC", ""],
            ]
    board = new Checkers(grid);
    board.drawBoard();
}