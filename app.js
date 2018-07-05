'use strict'

var express = require ('express');
var bodyParser = require('body-parser');
var app = require('./app')

var app = express();

var animalRoutes = require('./routes/animal');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api', animalRoutes);


app.get('/test', (req, res)=>{
    res.status(200).send({
        message: 'mi primer endpoint cerotessssssssssss'
    });
});

module.exports = app;