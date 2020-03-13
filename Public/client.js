console.log('Client-side code running');

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

  fetch('/p1_clicked', {method: 'POST'})
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

  fetch('/p1_clicked', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Scores were reset');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});