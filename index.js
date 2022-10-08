const express = require('express');
const hbs = require('hbs');
// const mysql = require('mysql2');
// const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const mongodb = require('mongodb')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

const MongoClient = mongodb.MongoClient;
const MONGOLOCAL = process.env.MONGOLOCAL;

try {
    MongoClient.connect(MONGOLOCAL, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    console.log(`Base de Datos Conectada a foro`);
} catch (error) {
    console.log(`No estamos conectados`);
}


// CONEXCION A MYSQL --------------------------------------------

// const conexion = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// });


// CONEXCION A MONGODB ------------------------------------------

// MongoClient.connect(process.env.HOST, (err, db) =>{
//     const database = db.db(process.env.DATABASE)
// });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/', (req, res) => {
    res.render('index', {
        titulo: 'Bienvenido a la app'
    })
});

//let sql = 'SELECT * FROM ipf6voifd90b45u3.foro'  // CONEXION A HEROKU !!!
// let sql = 'SELECT * FROM foro'    // CONEXION LOCAL !!!
// app.get('/formulario', (req, res) => {
//     conexion.query(sql, (err, result, fields) => {
//         if (err) throw err;
//         res.render('formulario', {
//             titulo: 'Bienvenido al Foro',
//             results: result,
//         });
//     });
// });


// MONGODB ----------------------

app.get('/formulario', (req, res) =>{

    MongoClient.connect(process.env.MONGOLOCAL, (error, db) =>{
        const database = db.db('Foro');
        if (error) {
            console.log(`No estamos conectados a la Database`);
        }else{
            console.log(`Conexion correcta a la Database`);
            database.collection('foro').find({}).toArray((error, result) =>{
                if (error) {
                    throw error;
                }else{
                    res.render('formulario', { 
                        result
                    })
                }
            })
        }
    });
});


app.get('/editarMensaje/:id', (req, res) => {
    MongoClient.connect(process.env.MONGOLOCAL, (error, db) =>{
        const database = db.db('Foro');
        if (error) {
            console.log(`No estamos conectados a la Database`);
        }else{
            console.log(`Conexion correcta a la Database`);

            let ObjectId = mongodb.ObjectId;
            let id = req.params.id;

            database.collection('foro').findOne({_id: ObjectId(id)}, (error, result) =>{
                if (error) {
                    throw error;
                }else{
                    res.render('editarMensaje', { 
                        result
                    })
                }
            })
        }
    })
});


app.put('/editar/:id', (req, res) =>{

    MongoClient.connect(process.env.MONGOLOCAL, (error, db) =>{
        const database = db.db('Foro');
        if (error) {
            console.log(`No estamos conectados a la Database`);
        }else{
            console.log(`Conexion correcta a la Database`);

            let ObjectId = mongodb.ObjectId;
            let id = req.params.id;

            console.log(ObjectId(id));
            
            const { nombre, email, mensaje} = req.body;

            database.collection('foro').findOne({_id: ObjectId(id)}, {$set: {nombre, email, mensaje}} ,(error, result) => {
                error? console.log(error.message) :
                database.collection('foro').replaceOne({_id: ObjectId(id)},{nombre, email, mensaje}, )
                    res.redirect('formulario')
                })
        }
    })
});


app.get('/formulario/:id', (req, res) => {

    MongoClient.connect(process.env.MONGOLOCAL, (error, db) =>{
        const database = db.db('Foro');
        if (error) {
            
        }else{
            
            
            const ObjectId = mongodb.ObjectId;
            const id = req.params.id;

        database.collection('foro').deleteOne({_id: ObjectId(id)}, (error, result) =>{
                if (error) {
                    throw error;
                }else{
                    res.redirect('/formulario')
                }
            })
        }
    })
});




// app.get('/formulario/:idForo', (req, res) => {
    //const sql = `DELETE FROM ipf6voifd90b45u3.foro WHERE id=' `+ req.params.idForo +`'`  //CONEXION A HEROKU

//     const sql = `DELETE FROM grupo.foro WHERE id=' `+ req.params.idForo +`'`    //CONEXION LOCAL
//     conexion.query(sql, (err, result, fields) => {
//         if (err) throw err;
//     });
//     res.redirect('/formulario');
// });




app.get('/programa', (req, res) => {
    res.render('programa', {
        titulo: 'Bienvenido al Programa de la UTN'
    })
});



// app.post('/formulario', (req, res) => {

//     const { nombre, email, mensaje } = req.body;

//     if (nombre == "" || email == "" || mensaje == "") {
//         let validacion = 'Rellene los campos correctamente';
//         res.render('formulario', {
//             titulo: 'Bienvenido al Foro',
//             validacion
//         });
//     } else {
//         let datos = {
//             nombre: nombre,
//             email: email,
//             mensaje: mensaje
//         };

        //let sql = 'INSERT INTO ipf6voifd90b45u3.foro SET ?';   //CONEXION A HEROKU !!! 
//         let sql = 'INSERT INTO foro SET ?';  // CONEXION LOCAL !!!

//         conexion.query(sql, datos, (err, results) => {
//             let envioDatos = 'Datos Enviados Con Éxito'
//             if (err) throw err;
//             res.render('formulario', {
//                 titulo: 'Bienvenido al Foro',
//                 envioDatos
//             });
//         });
//     };
// });


// MONGODB ---------------------------

app.post('/formulario', (req, res) => {
    
    const { nombre, email, mensaje } = req.body;
            
    MongoClient.connect(process.env.MONGOLOCAL, (error, db) =>{
        const database = db.db('Foro');
        if (error) {
            console.log(`No estamos conectados a la Database`);
        }else{ 

        console.log(`Conexion correcta a la Database`);        
            database.collection('foro').insertOne({ nombre, email, mensaje }, (error, result) => {
                if (error) {
                    throw error;
                }else{
                    res.render('formulario')
                }
            })  
        } 
    })
});


app.listen(PORT, () => {
    console.log('conectado');
});


