const express = require('express');
const cors = require('cors')
const fs = require('fs');   // Modulo para leer archivos
const data = require('./data.json');
const { error } = require('console');
const { title } = require('process');

require('dotenv').config(); // Cargamos las variables de entorno

// Inicializamos la appa de express
const app = express();
// Definimos el puerto donde estara corriendo nuestra API
// y cuando se trabaje en PROD sea cualquier valor configurado por el entorno o el 3002 en desarrollo
const PORT = process.env.PORT || 3002;  // Puerto por defecto 3002 

app.use(cors()) 

// Configuramos la  express para que pueda leer las peticiones JSON
app.use(express.json())

app.get('/api/homes', (req, res) =>{
    res.json(data)
})

/* POST /api/homes
    * Crea una nueva casa en el archivo data.json
*/
app.post('/api/homes', (req,res)=>{
    // Obtenemos los datos de la casa a crear
    const {title, price, location, bedrooms, bathrooms, square_feet, image} = req.body;

    // Validamos que todos los campos sean obligatorios
    if(!title || !price || !location || !bedrooms || !bathrooms || !square_feet || !image){
        return res.status(400).json({error: "Todos los campos son obligatorio"})
    }
    // Obtenemos el mayor ID de las casas y sumamos 1 para asiganar un 1 unico y creciente 
    //const newId = data.length > 0 ? Math.max(...data.map(home => home.id)) + 1 : 1;

    // Creamos el (nuevo objeto) ...la nueva casa con los datos enviados por el cliente
    const newHome = {
        id: data.length > 0 ? data[data.length -1].id +1 : 1,
        title,  
        price,
        location,
        bedrooms,
        bathrooms,
        square_feet,
        image
    }
    // agregamos la nueva priopiedad al array de datos
    data.push(newHome);

    // Guardamos los datos actualizados en el archivo 'data.json'
    fs.writeFile('./data.json', JSON.stringify(data, null, 2), (error) =>{
        if(error){
            console.error('Error al guardar los datos', error);
           return res.status(500).json({error : 'Error al guardar los datos'})
        }
        // Respondemos al cliente con la nueva casa creada
        res.status(201).json(newHome)
        })
    })


app.listen(PORT, () =>{
    console.log(` API de SmatHouse corriendo en http://localhost:${PORT} `)
})