
const express = require('express');

const { verificaToken } = require('../middleware/autenticacion');

const _ = require('underscore');

const app = express();

const Producto = require('../models/producto');

// ===========================
// Obtener productos
// ===========================
app.get('/productos', verificaToken, (req, res) => {

    //Traer todos los productos
    //traer la información de las tablas vinculadas con populate
    //Paginado

    //Declarar limites de paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true})
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec( (err, productos) => {
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        error: err
                    });
                };

                Producto.countDocuments({ disponible: true}, (err, conteo) => {
                    res.json({
                        ok: true,
                        productos,
                        items: conteo
                    });
                });
            });
});

// ===========================
// Obtener producto por ID
// ===========================
app.get('/productos/:id', verificaToken, (req, res) => {

    //traer la información de las tablas vinculadas con populate
    let idProducto = req.params.id;
    Producto.findOne( { _id: idProducto } )
             .populate('usuario', 'nombre email')
             .populate('Categoria', 'descripcion')
             .exec( (err, productoBD) => {
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        error: err
                    });
                };

                if(!productoBD) {
                    return res.status(400).json({
                        ok: false,
                        message: `El producto con id: ${idProducto} no existe en el catalogo`
                    })
                }

                res.status(201).json({
                    ok: true,
                    productoBD,
                });
             })
});

// ===========================
// Obtener productos por nombre o parte de el
// ===========================
app.get('/productos/buscar/:nombre', verificaToken, (req, res) => {

    //Traer todos los productos
    //traer la información de las tablas vinculadas con populate
    //Paginado

    //Declarar limites de paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let nombreProducto = req.params.nombre;

    let regex = new RegExp(nombreProducto, 'i');

    Producto.find({ nombre: regex })
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec( (err, productos) => {
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        error: err
                    });
                };

                Producto.countDocuments({ disponible: true}, (err, conteo) => {
                    res.json({
                        ok: true,
                        productos,
                        items: conteo
                    });
                });
            });
});


// ===========================
// Crear producto
// ===========================
app.post('/productos', verificaToken, (req, res) => {

    // grabar el usuario
    // grabar una categoria del listado

    let idUsuario = req.usuario._id;
    let body = req.body;

    let producto = new Producto({
        usuario: idUsuario,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoBD) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })    
        };

        if(!productoBD){
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                })    
            };
    
        }

        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });
});

// ===========================
// Actualizar producto
// ===========================
app.put('/productos/:id', (req, res) => {

    // grabar el usuario
    // grabar una categoria del listado

    let idProducto = req.params.id;
    let body = _.pick(req.body, [ 'nombre', 'precioUni', 'categoria', 'disponible', 'descripcion']);

    Producto.findByIdAndUpdate(idProducto, body, { new: true, runValidators: true }, (err, productoBD) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });   
        };

        if ( !productoBD ) {
            return res.status(400).json({
                ok: false,
                err
            });   
        };

        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });
});

// ===========================
// Actualizar producto
// ===========================
app.delete('/productos/:id', (req, res) => {

    // cambiar el estado de disponible en false

    // grabar el usuario
    // grabar una categoria del listado

    let idProducto = req.params.id;
    let body = _.pick(req.body, [ 'disponible']);
 
    body.disponible = false;

    console.log(body);

    Producto.findByIdAndUpdate(idProducto, body, { new: true, runValidators: true }, (err, productoBD) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });   
        };

        if ( !productoBD ) {
            return res.status(400).json({
                ok: false,
                err
            });   
        };

        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });
});

module.exports = app;
