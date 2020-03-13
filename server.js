console.log('Server-side code running');

var http = require('http');
var url = require('url');
            const express = require('express');
const MongoClient = require('mongodb').MongoClient;
            const app = express();

var q = require('./queries.js');

            // serve files from the public directory
            app.use(express.static('public'));

// connect to the db and start the express server
let db;
    
            const dbURL = 'mongodb://localhost:27017/tennis'; 

//connect to DB
            MongoClient.connect(dbURL, (err, database) => {
              if(err) {
                return console.log(err);
              }
            //create the db variable
              db = database.db('tennis');
              // start the express web server listening on 8080
              app.listen(8080, () => {
                console.log('TENNIS CONNECTED...listening on 8080');
              });
            });
//q.DBConnect();

// start the express web server listening on 8080
//app.listen(8080, () => {
//  console.log('listening on 8080');
//});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.post('/p1_clicked', (req, res) => {
    q.GetScore(function(items){         // PUT ALL LOGIC IN HERE
                                        // CHECK IF WINNING SCORE, ELSE UPDATE SCORE & END GAME. 
                                        // 
       console.log(items); 
    });
    
  //const click = {clickTime: "Time: " + new Date()};
    
    //working query
                    //  db.collection('games').findOne({}, function(err, result){
                    //      if (err) throw err;
                    //      time = result.clickTime;
                    //      console.log(time);
                    //  }).then;
           
    
//  db.collection('games').insertOne(click, (err, result) => {
//    if (err) {
//      return console.log(err);
//    }
//    console.log('click added to db');
//    res.sendStatus(201);
//  });
});

app.post('/p2_clicked', (req, res) => {
    q.GetScore(function(items){         // PUT ALL LOGIC IN HERE
                                        // CHECK IF WINNING SCORE, ELSE UPDATE SCORE & END GAME. 
                                        // 
       console.log(items); 
    });
    
});
      
app.post('/reset', (req, res) => {
    q.GetScore(function(items){         // PUT ALL LOGIC IN HERE
                                        // CHECK IF WINNING SCORE, ELSE UPDATE SCORE & END GAME. 
                                        // 
       console.log(items); 
    });
    
});
        

