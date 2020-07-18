
//==========================
//    Puerto
//==========================

process.env.PORT = process.env.PORT || 3000;

//==========================
//    Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================
//Cadena de conexión a la BD
//==========================

let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://atlas:TgNBXWYbH2PbSR40@cluster0.ig7hf.mongodb.net/cafe';    
}

process.env.URLDB = urlDB;