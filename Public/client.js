console.log('Client-side code running');

var holdForReset = false;

const p1_button = document.getElementById('p1_score_btn');
p1_button.addEventListener('click', function(e) {
  console.log('Player 1 scored');

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
  holdForReset = true;
  console.log('Reset Scores');

  fetch('/reset', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Scores were reset');
        enableBtns();
        holdForReset = false;
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

setInterval(function(){
   fetch('/updateUI', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(res) {
       if(holdForReset)
        return;
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
      document.getElementById("p1_score").innerHTML = p1_score;
      document.getElementById("p2_score").innerHTML = p2_score;
       
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
}, 1000);

function disableBtns(){
    document.getElementById("p1_score_btn").disabled = true;
    document.getElementById("p2_score_btn").disabled = true;
}

function enableBtns(){
    document.getElementById("p1_score_btn").disabled = false;
    document.getElementById("p2_score_btn").disabled = false;
}