/**
 * @file Gameplay.js interacts with the html file and does most of the computation.
 * @author Ryan Pope, Giang Nguyen, Hirsh Guha, Jordan Love, John Quitno
 * 
 */
var $ = function (id) { return document.getElementById(id);};


var gameplay = {

    rows:0,
    cols:0,
    mines:0,
    myBoard: new Board(1,1,1),
    dx: [-1,-1,0,1,1,1,0,-1],
    dy: [0,1,1,1,0,-1,-1,-1],
    ended:0,

    /**
        * Gets and verify the data from the html file, calls the board constructor then adds the .
        */
    start: function()
    {
        this.ended = 0;
        this.rows = $('rows').value;
        this.cols = $('cols').value;
        this.mines = $('mines').value;

        if (this.mines>=this.rows*this.cols) {
            alert("Too many mines!!! The maximum number of mines for this board is "+(this.rows*this.cols-1));
            return;
        }
        if (this.rows <2) {
            alert("The board must have at least 2 rows.");
            return;
        }
        if (this.cols <2) {
            alert("The board must have at least 2 columns.");
            return;
        }
        if (this.mines < 1) {
            alert("You need at least one mine!")
            return;
        }

        this.myBoard = new Board(this.rows,this.cols,this.mines);

        /*console.log(this.rows+" "+this.cols+" "+this.mines);
        for (let i=0;i<this.rows;i++)
        for (let j=0;j<this.cols;j++)
        if (this.myBoard.getNumber(i,j)==-1) console.log(i+" "+j);*/

        gameplay.add_grid();
        //onclick stuff

    },
    /**
        * Adds the grid of the correct size to the html file.
        */
    add_grid: function () {
        $('grid').innerHTML = '';
        for (let i = 0; i < this.rows; i++) {
            $('grid').innerHTML += '<br>';
            for (let j = 0; j < this.cols; j++) {
                gameplay.add_cell(i, j);
            }
        }
    },
    /**
        * Adds an individual cell to our grid.
        * @param {number} row - The row of the cell being added.
        * @param {number} column - The column of the cell being added.
        */
    add_cell: function (row, col) {
        var cell = this.myBoard.getNumber(row,col),
            id = 'id="cell-'+ row +'-'+ col +'"',
            classname = 'class="cell" ',
            onclick = 'onclick="gameplay.leftClick('+ row +','+ col +')" ',
            oncontext = 'oncontextmenu="gameplay.rightClick('+ row +','+ col +'); return false"',
            button = ('<button '+ id + classname + onclick
                      + oncontext + '>&nbsp;</button>');

        $('grid').innerHTML += button;
    },
    /**
        * Flags a tile.
        * @param {number} row - The row of the Tile.
        * @param {number} column - The column of the Tile.
        */
    rightClick: function(row, col)
    {
        if (this.ended) {
            this.ended++;
            if (this.ended>3) alert("C'mon, the game ended./nThere's nothing you can do.");
            return;
        }
        if (this.myBoard.isRevealed(row,col)) return;
        var id = 'cell-' + row + '-' + col;
        if (this.myBoard.flag(row,col)) {
            $(id).innerHTML = '&#9873';
            $(id).style.color = '#ff0000';
            gameplay.checkWin();
        }
        else {
            $(id).innerHTML = '&nbsp;';
            $(id).style.color = '#000000';
        }
    },
    /**
        * Returns true iff the given row and col are in the board.
        * @param {number} row - The row of the tile.
        * @param {number} col - The column of the tile.
        * @return {bool} - Returns true or false depending onn whether the coordinates are valid.
        */
    isInside: function(row, col)
    {
        return(row>=0 && col>=0 && row<this.rows && col<this.cols);
    },
    /**
        * Recursive function that reveals all tiles not next to a mine.
        * @param {number} row - The row of the tile.
        * @param {number} col - The column of the tile..
        */
    revealHelper: function(row, col)
    {
        if (!this.myBoard.reveal(row,col)) return;
        if (this.myBoard.getNumber(row,col)!=0) return;
        for(let i=0;i<8;i++) {
            let u = row+this.dx[i];
            let v = col+this.dy[i];
            if (gameplay.isInside(u,v)) gameplay.revealHelper(u,v);
        }
    },
    /**
        * Handles when a user left clicks and changes the board and game state accordingly..
        * @param {number} row - The row of the tile.
        * @param {number} col - The column of the tile..
        */
    leftClick: function(row,col)
    {
        if (this.ended) {
            this.ended++;
            if (this.ended>3) alert("C'mon, the game ended. There's nothing you can do.");
            return;
        }
        if (this.myBoard.isFlagged(row,col) || this.myBoard.isRevealed(row,col)) return;
        if (this.myBoard.getNumber(row,col)==-1)
        {
            this.checkLose(row,col);
        }
        else if (this.myBoard.getNumber(row,col)==0)
        {
            //recursive stuff
            gameplay.revealHelper(row,col);
            this.checkWin();
        }
        else
        {
            this.myBoard.reveal(row,col);
            this.checkWin();
        }
    },
    /**
        * Resets the board.
        */
    reset: function () {
        gameplay.start();
    },
    /**
        * Checks if a bomb was clicked and stopes the game if it was.
        */
    checkLose: function () {
        this.ended = 1;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                var id = 'cell-' + i + '-' + j;
                if (this.myBoard.getNumber(i,j) == -1)
                {
                    $(id).style.backgroundColor = '#ff0000';
                    $(id).innerHTML = '&#9728';
                }
                else{
                    $(id).style.backgroundColor = '#ccc';
                    $(id).innerHTML = '&#9760';
                }
            }
        }
    },
    /**
        * Checks the number of revealed squares to figure out if the game was won and alerts the user accordingly.
        */
    checkWin: function()
    {
        if(this.myBoard.getRevealed()==(this.rows*this.cols-this.mines))
        {
            this.ended = 1;
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    var id = 'cell-' + i + '-' + j;

                    if (this.myBoard.getNumber(i,j) == -1)
                    {
                        $(id).style.color = '#000000';
                        $(id).style.backgroundColor = '#00FF00';
                        $(id).innerHTML = '&#9728';
                    }
                    else{
                        $(id).style.backgroundColor = '#ccc';
                        $(id).innerHTML = '&#x2b50';
                    }
                }
            }
        }
    }
}
    /**
        * Starts the game when the window is loaded.
        */
window.onload = function ()
{
    gameplay.start();
}
