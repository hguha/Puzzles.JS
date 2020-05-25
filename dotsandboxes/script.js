
var winningCombos = [[1,5,7,14],[2,7,9,15],[3,9,11,16],[4,11,13,17],[14,18,20,27],[15,20,22,28],[16,22,24,29],[17,24,26,30],[27,31,33,40],[28,33,35,41],[29,35,37,42],[30,37,39,43],[40,44,46,53],[41,46,48,54],[42,48,50,55],[43,50,52,56]];

class DotsAndBoxes {
  constructor(player1, player2) {
    this.player = [player1, player2];
    this.clickedBorder = [];
    this.$borderID = $(".hor-border, .h1-border2");
    this.currentPlayer = 0;
  }

  updateClickedBoxArray(borderID) {
    this.clickedBorder.push(parseInt(borderID));
      if (!this.checkForWinner()) {
        //switch turns
        this.currentPlayer ^= 1;
        $("#next-turn").html("Player " + (this.currentPlayer + 1));
      }
  }

  checkForWinner() {
    var copyWinCombo = winningCombos;
    var completedBox = false;
      for (var i = 0; i < copyWinCombo.length; i++) {
        var found = false;
        for (var j = 0; j < copyWinCombo[i].length; j++) {
          if (this.clickedBorder.includes(copyWinCombo[i][j])) {
            found = true;
  
          } else {
            found = false;
            break;
          }
        }
  
        if (found) {
         $("#box"+i).css("background", this.player[this.currentPlayer].playerColor);
         var output = copyWinCombo.slice(i, i+1);
         copyWinCombo[i] = [];
         this.player[this.currentPlayer].boxesWon.push(output);
         var lastIndex = this.clickedBorder[this.clickedBorder.length -1];
          $("#"+lastIndex).unbind("mouseenter");
          $("#"+lastIndex).unbind("mouseleave");
          $("#"+lastIndex).css("background", "#505050");
          
          //see if someone won?

          completedBox = true;
       }
    }
    return completedBox;
  };

}

window.onload = () => {
  let player1 = { playerScore: 0, playerColor: "red", boxesWon: []  }
  let player2 = {playerScore: 0, playerColor: "blue", boxesWon: [] }
  
      var board = new DotsAndBoxes(player1, player2);
 

   //handle mouse input
   $(".hor-border, .h1-border2").on("click", function() {
     var id = $(this).attr("id");
     board.updateClickedBoxArray(id);
   });
 
  $(".hor-border, .h1-border2")
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
 