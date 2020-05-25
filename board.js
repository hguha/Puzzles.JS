class Board {
    constructor(board) {
        this.board = board;
        this.row = board.length;
        this.col = board[0].length;
        this.selected;
        this.selectedLoc;
        this.count = 0;
    }

    inRange(row, col) { //checks if a given square is on the board!
        return (row <= this.row - 1) && (row >= 0) && (col <= this.col - 1) && (col >= 0)
    }

    selectPiece(row, col) { //default action is just to highlight the selected in yellow
        $(".tile[style]").removeAttr("style");
        this.selected = $(`#tile-row-${row}-col-${col}`)[0];
        this.selectedLoc = [row, col];
        this.selected.style.background = "yellow";
    }

    fillSquare(row, col) {
        return this.board[row][col] ? this.board[row][col] : "";
    }

    drawBoard() {
        //remove an existing board from the DOM
        if($("#board-container #board").length) {
            $("#board-container #board").remove("#board");
        }
        //create a new board element based on the interal board array
        $("#board-container").append("<table id = 'board'></table>");
        for (let i = 0; i < this.row; i++) {
            var row = "<tr id='tile-row-" + i + "'></tr>";
            $("#board").append(row);
            for (let j = 0; j < this.col; j++) {
                var col = "<td onclick='board.selectPiece(" + i + "," + j + ")' class='tile row-"+i+" col-"+j+"' id='tile-row-" + i + "-col-" + j + "'>" + this.fillSquare(i, j) + "</tr>";
                $(`#tile-row-${i}`).append(col);
            }
        }
    }


    //just wipes everything off the board
    clear() {
        this.count = 0;
        this.board = Array(this.row).fill().map(() => Array(this.col).fill(""));
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                $(`#tile-row-${i}-col-${j}`).html("");
            }
        }
    }
}