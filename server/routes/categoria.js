const express = require('express');

const {verificaToken, verificaAdminRole} = require('../middleware/autenticacion'); 

const _ = require('underscore');


const app = express();

const Categoria = require('../models/categoria');

// ===========================
// Mostrar todas las categorias
// ===========================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
             .sort('descripcion')
             .populate('usuario', 'nombre email')
             .exec( (err, categorias) => {
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        error: err
                    });
                };

                Categoria.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        categorias,
                        items: conteo
                    });
                });
             });
});

// ===========================
// Mostrar una categoria por ID
// ===========================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let idCategoria = req.params.id;
    Categoria.findById(idCategoria, (err, categoria) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        };

        Categoria.count({}, (err, conteo) => {
            
            if(conteo == 0){
                return res.status(204).json({
                    ok: false,
                    message: 'No se encontraron categorias del id'
                }); 
            }

            res.json({
                ok: true,
                categoria,
                items: conteo
            });
        });
    })

});

// ===========================
// Crear una categoria
// ===========================
app.post('/categoria', verificaToken, (req, res) => {

    //Utilizar el id del token en req.token._id
    //Regresa la nueva categoria

    let id_usuario = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id_usuario
    });

    categoria.save((err, categoriaDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })    
        };

        if(!categoriaDB){
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                })    
            };
    
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


// ===========================
// Actualizar una categoria
// ===========================
app.put('/categoria/:id', verificaToken, (req, res) => {
    //Actualizar la descripcion de la categoria
    let idCategoria = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(idCategoria, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });   
        };

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });   
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ===========================
// Eliminar una categoria
// ===========================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Solo una administrador y token
    //findIdandRemove
    let idCategoria = req.params.id;
    
    Categoria.findByIdAndRemove(idCategoria, (err, categoriaDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });   
        };

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                message: `La categoria con id: ${idCategoria} no existe en el catalogo`
            });   
        };

        res.json({
            ok: true,
            message: `La categoria con id: ${idCategoria} fue eliminada`,
            categoriaDB
        });        
    });
});

module.exports = app;