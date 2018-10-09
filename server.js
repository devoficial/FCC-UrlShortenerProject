'use strict';

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// Connect using the connection string

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

MongoClient.connect("mongodb://devofficial:imdev1996@ds125453.mlab.com:25453/fccdata", {native_parser:true}, function(err, db) {
    if(err) return err;
    app.post("/api/shorturl/new",function(req,res){
          
      const longUrl=req.body.url;
     
      const randomNum = Math.round(Math.random()*1000)
      const shortUrl="https://"+req.headers["x-forwarded-host"]+"/"+randomNum
      
      if(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/ig.test(longUrl)){
        res.send({"original_url":longUrl,"short_url":shortUrl})
        db.collection("url").insertOne({"original_url":longUrl,"short_url":shortUrl})
      } else {
        res.send({"error":"Wrong url format."})
      }
    })


    app.get("/api/shorturl/:number",function(req,res){
      const shortUrl="https://"+req.headers["x-forwarded-host"]+"/"+req.params.number
      
      db.collection("url").find({"short_url":shortUrl},{"original_url":1,"_id":0}).toArray(function(err,docs){
        if(err) throw err
        //res.json(docs)
        docs.map(function(item){
          const result=res.redirect(item.original_url)
          return result
        })
        
      })
      
      
     
    })



    app.listen(port, function () {
      console.log('Node.js listening ...');
    });    
  });
