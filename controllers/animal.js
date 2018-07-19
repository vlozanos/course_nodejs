'use strict'

//modulos

var fs = require('fs');
var path = require('path');

var Animal = require('../models/animal');

function getAnimals(req, res){
    res.status(200).send({
        message : 'Probando el controlador de animales y que chingados'
    });
}

function getAnimal(req, res){
    var animalId = req.params.id;
    Animal.findById(animalId).exec((err, animal)=>{
        if(err){
            res.status(500).send({
                message: 'error en la petición'
            });
        }else{
            if(!animal){
                res.status(404).send({
                    message: 'Animal no existe'
                });
            }else{
                res.status(200).send({
                    animal
                });
            }
        }
    });
}


function saveAnimal(req,res){
    var animal = new Animal();

    var params = req.body;

    if(params.name){
        animal.name= params.name
        animal.description= params.description
        animal.origen.country = params.country
        animal.origen.state = params.state
        animal.image = null;

        animal.save((err, animalStored)=> {
            if(err){
                res.status(500).send({
                    message: 'Error en el servidor'
                });
            }else{
                if(!animalStored){
                    res.status(404).send({
                        message: 'No se ha guardado el animal'
                    });
                }else{
                    res.status(200).send({
                        message: animalStored
                    });
                }
            }
        });
    }else{
        res.status(200).send({
            message: 'El nombre del animal es obligatorio'
        });
    }
}
function updateAnimal(req, res) {
    var animalId = req.params.id;
    var update = req.body;

    Animal.findByIdAndUpdate(animalId, update, {new:true}, (err,animalUpdate)=>{
        if (err){
            res.status(500).send({
                message: 'error en la peticion'
            });
        }else {
            if(!animalUpdate){
                res.status(404).send({
                    message:'No se ha actualizado el animal'
                });
            } else {
                res.status(200).send({
                    animal:animalUpdate
                });
            }
        }
    });

}

function deleteAnimal(req, res){
    var animalId = req.params.id;

    Animal.findByIdAndRemove(animalId, (err, animalRemoved)=>{
        if(err){
            res.status(500).send({
                message: 'Error de petición'
            });
        }else{
            if(!animalRemoved){
                res.status(404).send({
                    message: 'no se ha encontrado el animal'
                });
            }else{
                res.status(200).send({
                    animal: animalRemoved
                });
            }
        }
    });
}

function uploadImage(req, res){
    var animalId = req.params.id;
    var file_name = 'no imagen';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg'){
            Animal.findByIdAndUpdate(animalId, {image: file_name}, {new: true}, (err, animalUpdated)=>{
                if(err){
                    res.status(500).send({
                        message:'Error al actualizar el animal'
                    });
                }else{
                    if(!animalUpdated){
                        res.status(404).send({
                            message: 'Nose ha actualizado el animal'
                        });
                    }else{
                        res.status(200).send({
                            animal: animalUpdated,
                            image: file_name
                        });
                    }
                }
            });
        }else{
            fs.unlink(file_path, (err)=>{
                if(err){
                    res.status(200).send({
                        message: 'Extension del arcivo no valida y no encontrada'
                    });
                }else{
                    res.status(200).send({
                        message: 'extensio del archivo no valida'
                    });
                }
            });
        }
    }else{
        res.status(200).send({
            message: 'no han subido ningun archivo'
        });
    }
}
module.exports ={
    getAnimals,
    saveAnimal,
    getAnimal,
    updateAnimal,
    deleteAnimal,
    uploadImage
}