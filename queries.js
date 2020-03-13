const MongoClient = require('mongodb').MongoClient;
var http = require('http');
var url = require('url');
            const express = require('express');
            const app = express();
var game_num = 1;
var set_no = 1;

module.exports = {
    
    
  GetScore: function f1(callback){
    return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        game = db.db('tennis').collection('games');
        game.findOne({"in_progress": true},function (err, items) {
            return  callback(items);     
      });
    });
  },
    
    
  p1Score: function f2(callback){
      return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        collection = db.db('tennis').collection('games'); 

        collection.updateOne({"in_progress":true}, {$inc: {"p1_score":1} }, (err, result) => {
        if (err) {
          return console.log(err);
        }
        console.log("updating p2score");
           // db.close();
        return callback(result);
      });
  });
  },
    
    
  p2Score: function f3(callback){
      return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        collection = db.db('tennis').collection('games');  
      
        collection.updateOne({"in_progress":true}, {$inc: {"p2_score":1} }, (err, result) => {
        if (err) {
          return console.log(err);
        }
        console.log("updating p2score");
            //db.close();
        return callback(result);
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
            set: 1,
            p1_wins: 0,
            p2_wins: 0,
            in_progress: true
        }
        sets.insertOne(set, (err, result) => {
        if (err) {
          return console.log(err);
        }
      });
          game_num = 1;
          set_no = 1;
        console.log('DATABASE INITIALIZED');
          
  });
 },
    
add_game: function f6(callback){
    return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        collection = db.db('tennis').collection('games');
        
        const score = 
          {
            set: set_no,
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
},

end_game: function f7(callback){
    return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        
        const currentType = {"in_progress":true};
        game = db.db('tennis').collection('games');
        
        //update set
        sett = db.db('tennis').collection('sets');
        
            game.findOne(currentType,function(err,gs){
               if(gs.p1_score > gs.p2_score){
                   //p1 wins
                   sett.updateOne(currentType,{$inc:{"p1_wins":1}});
               } 
                else{
                    //p2 wins
                      sett.updateOne(currentType,{$inc:{"p2_wins":1}});
                }
                
            //sett.findOne(currentType,function(err,items){
            sett.findOne({"in_progress":true},function(err2,items){
                if(err2){
                    console.error(err2);
                }
                console.log(items);
            //check if end of set
            if(items.p1_wins > 5 || items.p2_wins > 5){
                //end the set
                sett.updateOne(currentType,{$set:{"in_progress":false}});
                new_set_num = items.set + 1;
                
                sett.insertOne({"set":new_set_num,"p1_wins":0,"p2_wins":0,"in_progress":true});
                game_num = 0;
                
                //check if end of tournament
                if(items.p1_wins > items.p2_wins){
                    if(count == 3){
                        //end game
                        console.log("END GAME HERE:::: P1 WINS!");
                        console.log("END GAME HERE:::: P1 WINS!");
                        console.log("END GAME HERE:::: P1 WINS!");
                        console.log("END GAME HERE:::: P1 WINS!");
                        console.log("END GAME HERE:::: P1 WINS!");
                        return;
                    }
                }
               else if(items.p2_wins > items.p1_wins){
                   if(count == 3){
                        //end game
                        console.log("END GAME HERE:::: P2 WINS!");
                        console.log("END GAME HERE:::: P2 WINS!");
                        console.log("END GAME HERE:::: P2 WINS!");
                        console.log("END GAME HERE:::: P2 WINS!");
                        console.log("END GAME HERE:::: P2 WINS!");
                        return;
                    }
               }
            }
                else{ //not end of tournament
                  
                }
                
               });
                
                //else start new set... may be an issue with async
            //else add new game
           //else{
               //update game
        game.updateOne(currentType, {$set:{"in_progress" : false}});
            game.insertOne({
                set: set_no,
                game_no: ++game_num,
                p1_score: 0,
                p2_score: 0,
                in_progress: true,
            });
                
            });
                
                

                
           //}
            //});

                                  
        console.log('GAME ENDED'); 
        //db.close();
      });
}
};