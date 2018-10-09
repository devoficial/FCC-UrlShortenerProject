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

