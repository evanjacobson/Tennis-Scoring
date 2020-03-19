console.log('Server-side code running');
var assert = require('assert');
var http = require('http');
var url = require('url');
const dbURL = 'mongodb://localhost:27017/tennis';
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

var q = require('./queries.js');



// serve files from the public directory
app.use(express.static('public'));

// connect to the db and start the express server
let db;

//connect to DB
MongoClient.connect(dbURL, (err, database) => {
  if(err) {
    return console.log(err);
  }
//create the db variable
  db = database.db('tennis');
    
//reset the game
  q.initialize_DB(function(result){
      if(result.ok){
          console.log("Game has been automatically reset");
      }
  });
    
 
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('TENNIS CONNECTED...listening on 8080');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/p1_clicked', (req, res) => {
    scorePoint("p1");
    res.sendStatus(200);
});

app.post('/restart', (req,res) => {
    process.exit(1);
});


app.post('/p2_clicked', (req, res) => {
    scorePoint("p2");   
    res.sendStatus(200);
});
      
app.post('/reset', (req, res) => {
    q.initialize_DB(function(result){
        if(result.insertedCount == 1){
            console.log("Game has been manually reset");
            res.sendStatus(200);
        }
    });
});

app.get('/updateUI', function(req, res){
  q.GetScore(function(items){
  tournament = db.collection('tournament');
    tournament.findOne({}, function(err,val){
        set = db.collection('sets').findOne({"in_progress":true},function(err,setInfo){
        response = {
            "game":items,
            "set":setInfo,
            "tournament":val
        };
        res.json(response);
            });
          });
    });
});
 
function scorePoint(player){
        if(player == "p1"){
            //score a point
            q.p1Score(function(result){
                console.log("P1 SCORED");
                q.GetScore(function(game){
                    try{
                        if(game == null){
                            throw new Error("Database setup issue");
                        }
                        if(game.p1_score > game.p2_score && game.p1_score > 3 && game.p1_score-game.p2_score > 1){    //win game
                            console.log("P1 WINS THE GAME");
                            q.end_game();
                        }
                    }
                    catch(Error){
                        console.error(Error);
                    }
                    
                });

                });
            
        }
        else{   //p2
            q.p2Score(function(result){
                console.log("P2 SCORED");
                q.GetScore(function(game){
                    try{
                        if(game == null){
                            throw new Error("Database setup issue");
                        }
                        if(game.p2_score > game.p1_score && game.p2_score > 3 && game.p2_score-game.p1_score > 1){    //win game
                            console.log("P2 WINS THE GAME");
                            q.end_game();
                        }
                    }
                    catch(Error){
                        console.error(Error);  
                    }
                });
            });
        }
}

