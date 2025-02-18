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

    // Endpoint para eliminar una casa
    app.delete('/api/homes/:id', (req, res) =>{
        // Obtenemos el id del objeto (casa) a elimar
        const homeId = parseInt(req.params.id);

        // Realizamos la valizacion para saber si el objeto (casa) existe
        if(isNaN(homeId)){
            // si no existe retornamos un status 404 (Not Found)
            return res.status(400).json({error: 'ID invalido para eliminar'})
        }

        // Buscamos la casa en el array de datos
        const homeIndex = data.findIndex(home => home.id === homeId);

        // Si la casa no existe retornamos un status 404 (Not Found)
        if(homeIndex === -1){
            return res.status(404).json({error: 'Casa no encontrada'          
            })
        }
            // Eliminamos el objeto (casa) del array de tatos
        const deleteHome = data.splice(homeIndex, 1)[0];

        // Guardamos el nuevo array de datos en el archivo 'data.json
        fs.writeFile('./data.json', JSON.stringify(data, null, 2), (error)=>{
        // Si llega a ocurrir un error 
            if(error){
                console.log('Err0r al guardar los datos', error);
                // Mandamos una respuesta con un 500 (Internal Server Error)
                return res.status(500).json({error: 'Error al guardar los datos'})
            }
        // Si todo sale bien respondemos con 200 (OK) y la casa fue eliminada correctamente
        res.status(200).json({message: 'Casa eliminada correctamente', deleteHome})
        })
    })


app.listen(PORT, () =>{
    console.log(` API de SmatHouse corriendo en http://localhost:${PORT} `)
})