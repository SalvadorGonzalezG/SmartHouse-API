const express = require('express');
const cors = require('cors')
const fs = require('fs');   // Modulo para leer archivos
const data = require('./data.json');

// Inicializamos la appa de express
const app = express();
// Definimos el puerto donde estara corriendo nuestra API
const PORT = 3002;

app.use(cors()) 

// Configuramos la  express para que pueda leer las peticiones JSON
app.use(express.json())

app.get('/api/homes', (req, res) =>{
    res.json(data)
})

app.listen(PORT, () =>{
    console.log(` API de SmatHouse corriendo en http://localhost:${PORT} `)
})