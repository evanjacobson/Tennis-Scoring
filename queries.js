const MongoClient = require('mongodb').MongoClient;
var http = require('http');
var url = require('url');
            const express = require('express');
            const app = express();
var game = 0;
var set = 1;

module.exports = {
  GetScore: function f1(callback){
    return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        collection = db.db('tennis').collection('games');
        collection.find().toArray(function (err, items) {
        console.log(items);       
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
      });
  },
  p2Score: function f3(callback){
      return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        collection = db.db('tennis').collection('games');  
  });
 },
 initialize_DB: function f4(callback){
      return MongoClient.connect('mongodb://localhost:27017/tennis', function(err,db){
        if (err) {
          return console.dir(err);  
        }
        collection = db.db('tennis').collection('games');
        collection.remove({});
        const score = 
              {
                set: set,
                game_no: ++game,
                p1_score: 0,
                p2_score: 0,
                in_progress: true,
              };
  
        collection.insertOne(score, (err, result) => {
        if (err) {
          return console.log(err);
        }
        console.log('GAME ADDED');
      });
  });
 }
};