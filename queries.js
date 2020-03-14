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
    
  GetArchivedGame: function arc(setnum,gamenum,callback){
      return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        game = db.db('tennis').collection('games');
        game.findOne({"set":setnum,"game_no":gamenum},function (err, items) {
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
        return callback(result.result.ok);
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
        };
        sets.insertOne(set, (err, result) => {
        if (err) {
          return console.log(err);
        }
      });
          game_num = 1;
          set_no = 1;
          
        tournament = db.db('tennis').collection('tournament');
        tournament.deleteMany({});
        const tourney = {
            "p1_sets_won":0,
            "p2_sets_won":0
        };
          
        tournament.insertOne(tourney, function(err, result){
        if (err) {
          return console.log(err);
        }
            return callback(result);
        });
          
        console.log('DATABASE INITIALIZED');
          
  });
 },

end_game: function f5(callback){
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
            sett.findOne({"in_progress":true},function(err2,items){
                if(err2){
                    console.error(err2);
                }
                
    

            //check if end of set
            if((items.p1_wins > 5 || items.p2_wins > 5) && Math.abs(items.p1_wins-items.p2_wins) > 1){
                tournament = db.db('tennis').collection('tournament');
                if(items.p1_wins > items.p2_wins){
                    tournament.updateOne({},{$inc:{"p1_sets_won":1}});
                }
                else if(items.p2_wins > items.p1_wins){
                    tournament.updateOne({},{$inc:{"p2_sets_won":1}});
                }
                
                
                new_set_num = items.set + 1;
               
                game_num = 0;
                
                
              //query to determine if tournament is over
                tournament.findOne({$or: [{"p1_sets_won":2},{"p2_sets_won":2}]}, function(err,val){
                    //end the  current game and set
                    sett.updateOne(currentType,{$set:{"in_progress":false}});
                    game.updateOne(currentType, {$set:{"in_progress" : false}});
                   if(val == null){
                       sett.insertOne({"set":new_set_num,"p1_wins":0,"p2_wins":0,"in_progress":true});
                       game.insertOne({
                        set: new_set_num,
                        game_no: ++game_num,
                        p1_score: 0,
                        p2_score: 0,
                        in_progress: true,
                    });    
                       
                   }
                    //else do not end the games. this is just for display purposes
                });  
                
            }
                else{ //not end of set
                   game.updateOne(currentType, {$set:{"in_progress" : false}});
                   game.insertOne({
                            set: items.set,
                            game_no: ++game_num,
                            p1_score: 0,
                            p2_score: 0,
                            in_progress: true,
                        });
                }
                
            });
            });

                                  
        console.log('GAME ENDED'); 
      });
}
};