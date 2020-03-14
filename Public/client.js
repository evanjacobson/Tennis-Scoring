console.log('Client-side code running');

const p1_button = document.getElementById('p1_score_btn');
p1_button.addEventListener('click', function(e) {
  console.log('Player 1 scored');
  stopUI();
  startUI();
  fetch('/p1_clicked', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Player 1\'s score was updated');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

const p2_button = document.getElementById('p2_score_btn');
p2_button.addEventListener('click', function(e) {
  console.log('Player 2 scored');
  stopUI();
  startUI();
  fetch('/p2_clicked', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Player 2\'s score was updated');
        
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

const reset_button = document.getElementById('reset');
reset_button.addEventListener('click', function(e) {
  console.log('Reset Scores');
 stopUI();
  fetch('/reset', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Scores were reset');
        enableBtns();
        setDefaultUI();          
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

var UI_Updater;
function startUI(){
    UI_Updater = setInterval(function(){
       fetch('/updateUI', {method: 'GET'})
        .then(function(response) {
          if(response.ok) return response.json();
          throw new Error('Request failed.');
        })
        .then(function(res) {
           game = res.game;
           tournament = res.tournament;
           set = res.set;
          var p1_score = game.p1_score;
          var p2_score = game.p2_score;
          var p1_games_won = set.p1_wins;
          var p2_games_won = set.p2_wins;
          var set_num = game.set;
          var game_num = game.game_no;
          var p1_sets_won = tournament.p1_sets_won;
          var p2_sets_won = tournament.p2_sets_won;

        //update game and set numbers
           document.getElementById("current_set_tbl").innerHTML = set_num;
           document.getElementById("current_set_lbl").innerHTML = set_num;
           document.getElementById("current_game").innerHTML = game_num;

        //update score
          score = determineScore(p1_score,p2_score);
          document.getElementById("p1_score").innerHTML = score.p1;
          document.getElementById("p2_score").innerHTML = score.p2;

        //update leaderboard
           //games
        document.getElementById("p1_games_won").innerHTML = p1_games_won;
        document.getElementById("p2_games_won").innerHTML = p2_games_won;
           //sets
        document.getElementById("p1_sets_won").innerHTML = p1_sets_won;
        document.getElementById("p2_sets_won").innerHTML = p2_sets_won;

        //update winner if applicable
          if(tournament.p1_sets_won == 2){
              document.getElementById("winner").innerHTML = "<h3>Game Over! Player 1 Won the Tournament!</h3>";
              disableBtns();
          }
          else if(tournament.p2_sets_won == 2){
              document.getElementById("winner").innerHTML = "<h3>Game Over! Player 2 Won the Tournament!</h3>";
              disableBtns();
          }
           else{
               document.getElementById("winner").innerHTML = "";
           }

        })
        .catch(function(error) {
          console.log(error);
        });
    }, 100);
}

function stopUI(){
    clearInterval(UI_Updater);
}

function disableBtns(){
    document.getElementById("p1_score_btn").disabled = true;
    document.getElementById("p2_score_btn").disabled = true;
}

function enableBtns(){
    document.getElementById("p1_score_btn").disabled = false;
    document.getElementById("p2_score_btn").disabled = false;
}

function determineScore(p1,p2){
    p1_str="love",p2_str="love";
    
    p2_str = scoreHelper(p2,p1);
    
    if(p1 == p2){
        if(p1 == 0)
            return {p1:"love",p2:"love"};
        else{
            p2_str = "all";
        }
    }
    
    p1_str = scoreHelper(p1,p2);

    return {p1:p1_str,p2:p2_str};
}

function scoreHelper(p1,p2){
    switch(p1){
        case 0:
            return "love";
        case 1:
            return "15";
        case 2:
            return "30";
        case 3:
            return "40";
        default:
            if(p1 > p2 && p1-p2 > 1) { // p1 wins
                return "GAME";
            }
            else if(p1 > p2 && p1-p2 == 1) { //p1 has advantage
                return "ADVANTAGE";
            }
            else {                       //
                return "40";
            }
    }
}

function setDefaultUI(){
    document.getElementById("p1_score").innerHTML = "love";
        document.getElementById("p2_score").innerHTML = "love";
        document.getElementById("p1_games_won").innerHTML = 0;
        document.getElementById("p2_games_won").innerHTML = 0;
        document.getElementById("p1_sets_won").innerHTML = 0;
        document.getElementById("p2_sets_won").innerHTML = 0;
        document.getElementById("current_set_tbl").innerHTML = 1;
        document.getElementById("current_set_lbl").innerHTML = 1;
        document.getElementById("current_game").innerHTML = 1;
        enableBtns();
}
