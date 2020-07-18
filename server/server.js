require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));


mongoose
    .connect(process.env.URLDB, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then((result) => console.log("Conectado a MongoDB"))
    .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
    console.log('Estoy escuchando en el puerto 3000');
});