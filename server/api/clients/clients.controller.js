'use strict';

var _ = require('lodash');
var config = require('../../config/environment');

// Configure mongo access
var MongoClient,
    url = config.mongo.uri;

MongoClient = require('mongodb').MongoClient;

// Get list of clients
exports.findAll = function(req, res) {
  MongoClient.connect(url, function(err, db) {
    var clients = db.collection('clients');

    clients.find({}).toArray(function(err, docs){
      res.json(docs);
      db.close();
    });
  });
};

//Get clients
exports.findAllOrById = function(req, res) {
  MongoClient.connect(url, function(err, db) {
    var clients = db.collection('clients');
    //var query = req.query && req.query._id ? {'_id' : parseInt(req.query._id)} : {};

    var query;

    if(req.query && req.query._id){
      //find one
      clients.findOne({_id: parseInt(req.query._id)}, function(err, doc){
        res.json(doc);
        db.close();
        return;
      });
    }else if(req.query && req.query.query){
      query = {'name': {$regex: req.query.query}};
    }else{
      query = {};
    }

    clients.find(query).toArray(function(err, docs){
      res.json(docs);
      db.close();
    });

  });
};