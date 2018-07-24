'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'quitartoken';

exports.ensureAuth = function(req, res, next){
    var authorizationHeader = req.headers.authorization;
    if(!authorizationHeader){
        return res.status(403).send({
            message: 'la peticion debe de contener un header de autenticacion.'
        });
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');
    try{
        var payload = jwt.decode(token, secret);
        var expiredDate = payload.exp;
        var currentDate = moment().unix();
        if(expiredDate <= currentDate){
            return res.status(401).send({
                message: 'el token ha expirado'
            });
        }
        
    }catch(exception){
        return res.status(404).send({
            message: 'Token invalido'
        })
    }
    req.user = payload;
    next();
};