
//==========================
//    Puerto
//==========================

process.env.PORT = process.env.PORT || 3000;

//==========================
//    Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================
// Vencimiento del Token
//==========================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 60 * 60;

//==========================
//    Entorno
//==========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

//==========================
//Cadena de conexión a la BD
//==========================

let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;    
}

process.env.URLDB = urlDB;

//==========================
//Google Client Id
//==========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '773721796908-tj3qpdmkd40ouurasa8nkea7a1jemhg5.apps.googleusercontent.com';
