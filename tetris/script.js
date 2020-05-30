var board;
var running = null;
class Tetris extends Board {
    constructor(board) {
        super(board);
        this.turn = -1;
        this.newPiece = true;
        this.piece;
        this.colorMapping = ["red", "blue", "green", "cyan", "yellow", "orange", "purple"]

    }
    selectPiece(row, col) {} //undo the board's default

    fillSquare(row, col) {
        return "";
    }
    
    checkFull() {
        for(let i = 0; i < 24; i++) {
            let count = 0;
            for(let j = 0; j < 10; j++) {
                if(this.board[i][j]) count++;
                if(count == 10) {
                    this.board.unshift(new Array(10).fill(0));
                    this.board.splice(i,0);
                }
            }
        }
    }

    getPiece() {
        let pieces = [
            { //L piece
                id: 1,
                shape: [[1, 0],[1, 0], [1, 1]],
                coords: [ [0,5], [1,5], [2,5], [2,6] ],
                edges: [0,6, 2, 5],
            },
            { //reverse L piece
                id: 2, 
                shape: [[2, 2],[2, 0], [2, 0]],
                coords: [ [0,5], [0,6], [1,5], [2,5] ],
                edges: [0,6, 2, 5],
            },
            { //Long L piece
                id: 3, 
                shape: [[3],[3], [3], [3]],
                coords: [ [0,5], [1,5], [2,5], [3,5] ],
                edges: [0,5, 3, 5],
            },
            { //square piece
                id: 4,
                shape: [[4, 4],[4,4]],
                coords: [ [0,5], [0,6], [1,5], [1,6] ],
                edges: [0,6, 1, 5],
            },
            { //squiggly piece
                id: 5,
                shape: [[0,5,5],[5,5,0], [0,0,0]],
                coords: [ [0,5], [0,6], [1,4], [1,5] ],
                edges: [0,6, 1, 5],
            },
            { //reverse piece
                id: 6, 
                shape: [[6,6,0],[0,6,6], [0,0,0]],
                coords: [ [0,5], [0,6], [1,6], [1,7] ],
                edges: [0,6, 1, 5],
            },
            { //t-block piece
                id: 7,
                shape: [[0,7, 0],[7,7,7], [0,0,0]],
                coords: [ [0,5], [1,4], [1,5], [1,6] ],
                edges: [0,6, 1, 5],
            },

        ];
        let index = Math.floor(Math. random() * pieces.length);
        return pieces[2];
    }

    updateScreen() {
        for(let i = 0; i < 24; i++) {
            for(let j = 0; j < 10; j++) {
                if(this.board[i][j]) $(`#tile-row-${i}-col-${j}`)[0].style.background = this.colorMapping[this.board[i][j]];
                else $(`#tile-row-${i}-col-${j}`)[0].style.background = "gray";
            }
        }
    }
    //fill the baord with the coords of the piece
    updateBoard() {
        for(let i = 0; i < this.piece.coords.length; i++) {
            let x = this.piece.coords[i][0], y = this.piece.coords[i][1]
            this.board[x][y] = this.piece.id;
        }
        this.updateScreen();
    }

    getCoords(shape, start) {
        let coords = [];
        for(let i = 0; i < shape.length; i++) {
            for(let j = 0; j < shape[i].length; j++) {
                if(shape[i][j]) coords.push([start[0]+i, start[1]+j])
            }
        }

        return coords;
    }

    getEdges(coords) {
        let edges = []
        let transpose = coords[0].map((col, i) => coords.map(row => row[i]));
        edges.push(Math.min(...transpose[0]))  //top
        edges.push(Math.max(...transpose[1])) //right
        edges.push(Math.max(...transpose[0])) //bottom
        edges.push(Math.min(...transpose[1])) //left
        return edges;
    }

    forceDown() {
        while(!this.newPiece) {
            this.draw();
        }
    }



    down() {
        for(let i = 0; i < this.piece.coords.length; i++) {
                this.board[this.piece.coords[i][0]][this.piece.coords[i][1]] = 0;
                this.piece.coords[i][0]++;
        }
        this.piece.edges[0]++;
        this.piece.edges[2]++;
        this.updateBoard();
    }

    collide() {
        //check if we've hit
        let hit = false;
        if(this.piece.edges[2] == 23) return true;

        for(let i = 0; i < this.piece.coords.length; i++) {
            if(this.piece.coords[i][0] == this.piece.edges[2]) {
                let x = this.piece.edges[2]+1, y = this.piece.coords[i][1];
                if(this.board[x][y]) return true;
            }
        }
        return false;
    }

    draw() {
        if(this.newPiece) {
            this.piece = this.getPiece();
            this.updateBoard();
            this.newPiece = false;
        }
        //there is a piece moving
        else {
            //check if we've hit
            let hit = this.collide();
            
            //if we have space underneath the piece:
            if(!hit) this.down();
            else this.newPiece = true;
        }    
        this.checkFull();
    }

    move(dir) {
        if(dir == -1 && this.piece.edges[3] == 0) {return;}
        if(dir == 1 && this.piece.edges[1] == 9) return;
        for(let i = 0; i < this.piece.coords.length; i++) {
            this.board[this.piece.coords[i][0]][this.piece.coords[i][1]] = 0;
            this.piece.coords[i][1]+=dir;
        }
        this.piece.edges[1] += dir;
        this.piece.edges[3] += dir;
        this.updateBoard();
    }

    rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [ matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
    
        if (dir > 0) matrix.forEach(row => row.reverse());
        else  matrix.reverse();

        for(let i = 0; i < matrix.length; i++)
            matrix[i] = matrix[i].filter((val) => {return val !== undefined});
       
        matrix = matrix.filter((val) => {if(val) return val});
        let top = this.piece.edges[0];
        let left = this.piece.edges[3];
        this.piece.shape = matrix;

        //clear old
        for(let i = 0; i < this.piece.coords.length; i++) {
            this.board[this.piece.coords[i][0]][this.piece.coords[i][1]] = 0;
        }


        this.piece.coords = this.getCoords(matrix, [top, left]);
        this.piece.edges = this.getEdges(this.piece.coords);
        this.updateBoard();
        return matrix;
    }

    start() {
        this.draw();
        running = setInterval(() => {
            this.draw();
        }, 100);
    }

}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

window.onload = () => {
    let grid = Array(24).fill().map(() => Array(10).fill(0));
    board = new Tetris(grid);
    board.drawBoard();
    board.start();
}

document.addEventListener('keydown', (event) => {
    switch(event.keyCode) {
        case 32: board.forceDown(); break;
        case 37: board.move(-1); break;
        case 39: board.move(1); break;
        case 38: board.rotate(board.piece.shape, 1); break;
    }
});