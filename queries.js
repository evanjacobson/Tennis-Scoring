const MongoClient = require('mongodb').MongoClient;
var http = require('http');
var url = require('url');
            const express = require('express');
            const app = express();
var game_num = 1;
var set = 1;

module.exports = {
    
    
  GetScore: function f1(callback){
    return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        game = db.db('tennis').collection('games');
        game.find({"in_progress": true}).toArray(function (err, items) {
        return callback(items);     
      });
    });
  },
    
    
  p1Score: function f2(callback){
      return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        collection = db.db('tennis').collection('games'); 
          const game = 
              {
                set: set,
                game_no: game_num
              };
          console.log("GAME: " + game);

        collection.update(game, {$inc: {"p1_score":1} }, (err, result) => {
        if (err) {
          return console.log(err);
        }
        console.log('Player 1 Score Updated');
      });
  });
  },
    
    
  p2Score: function f3(callback){
      return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        collection = db.db('tennis').collection('games');  
        const game = 
          {
            set: set,
            game_no: game_num
          };
console.log("TESTSREST");
        collection.update(game, {$inc: {"p2_score":1} }, (err, result) => {
        if (err) {
          return console.log(err);
        }
        console.log('Player 2 Score Updated');
      });
  });
 },
    
    
 initialize_DB: function f4(callback){
      return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        games = db.db('tennis').collection('games');
        games.deleteMany({});
        const score = 
              {
                set: 1,
                game_no: 1,
                p1_score: 0,
                p2_score: 0,
                in_progress: true,
              };
          
        games.insertOne(score, (err, result) => {
        if (err) {
          return console.log(err);
        }
        });
            
        sets = db.db('tennis').collection('sets');
        sets.deleteMany({});
        const set = {
            number: 1,
            p1_wins: 0,
            p2_wins: 0,
            in_progress: true
        }
        sets.insertOne(set, (err, result) => {
        if (err) {
          return console.log(err);
        }
      });
        console.log('DATABASE INITIALIZED');
          
  });
 },

end_game: function f6(callback){
    return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        game = db.db('tennis').collection('games');
        const game = 
              {
                set: set,
                game_no: game_num
              };
        
        //update game
        game.update(game, {"in_progress" : false}, (err, result) => {
        if (err) {
          return console.log(err);
        }
        });
            
        //update set
        set = db.db('tennis').collection('sets');
        set.find({"set" : set}).toArray(function (err, items)/*).then(function(items)*/{
            assert(items.length == 1);
            item = items[0];
            game.find({"set":set,"game":game}).toArray(function(err,gs)/*).then(function(gs)*/{
               if(gs.p1_score > gs.p2_score){
                   //p1 wins
                   set.update({"set":items.set},{$inc:{"p1_wins":1}});
               } 
                else{
                    //p2 wins
                    set.update({"set":items.set},{$inc:{"p2_wins":1}});
                }
                
            //check if end of set
            if(set.p1_wins == 6 || set.p2_wins == 6){
                //end the set
                set.update({"set":items.set},{"in_progress":false});
                //check if end of tournament
                var endFlag = false;
                set.count({"p1_wins":{$gt : "p2_wins"}, "in_progress":false}, function(err, count) {
                    if(count == 3){
                        //end game
                        console.log("END GAME HERE:::: P1 WINS!");
                        console.log("END GAME HERE:::: P1 WINS!");
                        console.log("END GAME HERE:::: P1 WINS!");
                        console.log("END GAME HERE:::: P1 WINS!");
                        console.log("END GAME HERE:::: P1 WINS!");
                        endFlag = true;
                    }
                });
                
                set.count({"p2_wins":{$gt : "p1_wins"}, "in_progress":false}, function(err, count) {
                    if(count == 3){
                        //end game
                        console.log("END GAME HERE:::: P2 WINS!");
                        console.log("END GAME HERE:::: P2 WINS!");
                        console.log("END GAME HERE:::: P2 WINS!");
                        console.log("END GAME HERE:::: P2 WINS!");
                        console.log("END GAME HERE:::: P2 WINS!");
                        endFlag = true;
                    }
                });
          

                //else start new set... may be an issue with async
                if(!endFlag){
                   set.insertOne({$inc:{"set":1},"p1_wins":0,"p2_wins":0,"in_progress":true});
                }
            }
            //else add new game
            set.insertOne({"set":set,"p1_wins":0,"p2_wins:":0,"in_progress:":true}, (err, result) => {
                    if (err) {
                      return console.log(err);
                    }
                    console.log('NEW GAME ADDED');
                  });
            //});
        });
                                  
        console.log('GAME ENDED');
      });
  });
},

add_game: function f7(callback){
    return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        collection = db.db('tennis').collection('games');
        
        const score = 
          {
            set: set,
            game_no: ++game_num,
            p1_score: 0,
            p2_score: 0,
            in_progress: true,
          };
        
          
        collection.insertOne(score, (err, result) => {
        if (err) {
          return console.log(err);
        }
        console.log('NEW GAME ADDED');
      });
  });
}
};