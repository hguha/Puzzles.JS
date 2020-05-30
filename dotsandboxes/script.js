
var winningCombos = [[1,5,7,14],[2,7,9,15],[3,9,11,16],[4,11,13,17],[14,18,20,27],[15,20,22,28],[16,22,24,29],[17,24,26,30],[27,31,33,40],[28,33,35,41],[29,35,37,42],[30,37,39,43],[40,44,46,53],[41,46,48,54],[42,48,50,55],[43,50,52,56]];

class DotsAndBoxes {
  constructor(player1, player2) {
    this.player = [player1, player2];
    this.clickedBorder = [];
    this.currentPlayer = 0;
    this.total = 0;
  }

  selectPiece(borderID) {
    this.clickedBorder.push(parseInt(borderID));
      if (!this.updateBoard()) {
        //switch turns
        this.currentPlayer ^= 1;
        $("#next-turn").html("Player " + (this.currentPlayer + 1));
      }
  }

  checkWinner() {
    let one = this.player[0].score, two = this.player[1].score;
    if(one == two) $("#messages").html("It's a draw!");
    if(one > two) $("#messages").html("Player1 Wins!");
    if(one < two) $("#messages").html("Player2 Wins!");
  }

  updateBoard() {
    var copy = winningCombos;
    var completedBox = false;
      for (var i = 0; i < copy.length; i++) {
        var found = false;
        for (var j = 0; j < copy[i].length; j++) {
          if (this.clickedBorder.includes(copy[i][j])) {
            found = true;
  
          } else {
            found = false;
            break;
          }
        }
  
        if (found) {
            $("#box"+i).css("background", this.player[this.currentPlayer].playerColor);
            copy[i] = [];
            this.player[this.currentPlayer].score++;
            $("#p"+(this.currentPlayer+1)).html(this.player[this.currentPlayer].score);
            
            var lastIndex = this.clickedBorder[this.clickedBorder.length -1];
            $("#"+lastIndex).unbind("mouseenter");
            $("#"+lastIndex).unbind("mouseleave");
            $("#"+lastIndex).css("background", "#505050");
          
            this.total++;
            if(this.total == 16) {
              this.checkWinner();
            }

          completedBox = true;
       }
    }
    return completedBox;
  };

}

window.onload = () => {
  let player1 = { score: 0, playerColor: "#5cfcff" }
  let player2 = {score: 0, playerColor: "#ff0051" }
  
      var board = new DotsAndBoxes(player1, player2);
 

   //handle mouse input
   $(".side, .top").on("click", function() {
     var id = $(this).attr("id");
     board.selectPiece(id);
   });
 
  $(".side, .top")
     .bind("mouseenter", function() {
       $(this).css("background", "#FFCC00");
     })
     .bind("mouseleave", function() {
       $(this).css("background", "");
     })
     .bind("click", function() {
       $(this).unbind("mouseenter");
       $(this).unbind("mouseleave");
       $(this).css("background", "#505050");
     });
 
 }
 