'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');

var User = require('../models/user');

function prueba(req, res){
    res.status(200).send({
        message : 'Probando el controlador de animales y que chingados'
    });
}

function register(req, res){
    var user = new User ();
    var params = req.body;

    if(params.name && params.lastname && params.email && params.password){

        user.name = params.name;
        user.lastname = params.lastname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        User.findOne({email: user.email.toLowerCase},(err, issetUser)=>{
            if (err){
                res.status(500).send({
                    message: 'error en el servidor'
                });
            }else{
                if(!issetUser){
                    bcrypt.hash(params.password,null, null,(err, hash)=>{
                        user.password = hash;

                        user.save((err, userStored)=>{
                            if (err){
                                res.status(500).send({
                                    message: 'Error al guardar usuario'
                                })
                            }else{
                                if(!userStored){
                                    re.status(404).send({
                                        message: 'no se ha registrado el usuario'
                                    });
                                }else{
                                    res.status(200).send({
                                        user: userStored
                                    });
                                }
                            }
                        });
                    });
                }else{
                    res.status(200).send({
                        message: 'El usuario no se pudo registrar'
                    });
                }
            }
        });
    }else{
        res.status(200).send({
            message: 'parametros erroneos'
        });
    }
}

function login(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, issetUser) => {
        if (err) {
            res.status(500).send({
                message: 'Error al buscar su usuario'
            });
        } else {
            if (issetUser) {
                bcrypt.compare(password, issetUser.password, (err, check) => {
                    if (check) {
                        if (params.gettoken) {
                            res.status(200).send({
                                token: jwt.createToken(issetUser)
                            });
                        } else {
                            res.status(200).send({
                                issetUser
                            });
                        }
                    } else {
                        res.status(200).send({
                            message: 'El usuario no se ha logueado correctamente'
                        });
                    }
                })
            } else {
                res.status(404).send({
                    message: 'El usuario no ha podido loguearse'
                });
            }
        }
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var updateData = req.body;

    delete updateData.password;
    if(userId != req.user.sub) {
        return res.status(401).send({
            message: 'no tiene permiso para modificar este usuario.'
        });
    }
    User.findOneAndUpdate(userId, updateData, {new: true},(err, userUpdated)=>{
        if (err){
            res.status(500).send({
                message:'Error al actualizar el usuario'
            });
        }else{
            if(!userUpdated){
                res.status(404).send({
                    message:'no se ha podido actualizar el usuario'
                });
            }else{
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    })
}

module.exports ={
    prueba,
    register,
    login,
    updateUser
}