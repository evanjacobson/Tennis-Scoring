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

  fetch('/reset', {method: 'POST'})
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

setInterval(function(){
   fetch('/updateUI', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      //document.getElementById('counter').innerHTML = `Button was clicked ${data.length} times`;
       console.log(data);
    })
    .catch(function(error) {
      console.log(error);
    });
}, 2000);