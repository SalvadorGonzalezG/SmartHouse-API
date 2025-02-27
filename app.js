const express = require("express");
const cors = require("cors");
const fs = require("fs"); // Modulo para leer archivos
const data = require("./data.json");
const userRoutes = require("./routes/userRoutes"); //importacion rutas del usuario


require("dotenv").config(); // Cargamos las variables de entorno

// Inicializamos la appa de express
const app = express();
// Definimos el puerto donde estara corriendo nuestra API
// y cuando se trabaje en PROD sea cualquier valor configurado por el entorno o el 3002 en desarrollo
const PORT = process.env.PORT || 3002; // Puerto por defecto 3002

app.use(cors());

// Configuramos la  express para que pueda leer las peticiones JSON
app.use(express.json()); //se habilita el json enel body
app.use(express.urlencoded({extended: true})) //Soporte para foms

app.use("/api", userRoutes);
app.get("/api/homes", (req, res) => {
  res.json(data);
});

/* POST /api/homes
 * Crea una nueva casa en el archivo data.json
 */
app.post("/api/homes", (req, res) => {
  // Obtenemos los datos de la casa a crear
  const {userId, title, price, location, bedrooms, bathrooms, square_feet, image } =
    req.body;

  // Validamos que todos los campos sean obligatorios
  if (
    !title ||
    !price ||
    !location ||
    !bedrooms ||
    !bathrooms ||
    !square_feet ||
    !image
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorio" });
  }
  // Obtenemos el mayor ID de las casas y sumamos 1 para asiganar un 1 unico y creciente
  //const newId = data.length > 0 ? Math.max(...data.map(home => home.id)) + 1 : 1;

  // Creamos el (nuevo objeto) ...la nueva casa con los datos enviados por el cliente
  const newHome = {
    id: data.length > 0 ? data[data.length - 1].id + 1 : 1,
    userId: parseInt(userId), // asociando la propiedad con el ID del usario creado y parseando el dato por si llegara como un string
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    square_feet,
    image,
  };
  // agregamos la nueva priopiedad al array de datos
  data.push(newHome);

  // Guardamos los datos actualizados en el archivo 'data.json'
  fs.writeFile("./data.json", JSON.stringify(data, null, 2), (error) => {
    if (error) {
      console.error("Error al guardar los datos", error);
      return res.status(500).json({ error: "Error al guardar los datos" });
    }
    // Respondemos al cliente con la nueva casa creada
    res.status(201).json(newHome);
  });
});

//Enpoint para obtener todas la casas poblicadas por un usuario
app.get("/api/homes/user/:userId", (req, res)=>{
    // obtener el ID del usuario desde los parametros de la URL
    const userId = parseInt(req.params.userId);
    // Validamos que el ID sea un numero valido
    if(isNaN(userId)){
        return res.status(400).json({error: "Id del usuario incorrecto"})
    }
    // filtramos las casas que pertenecen a ese usuario con el ID proporcionado 
    const userHomes = data.filter((home)=> home.userId === userId);
    // respondemos con la lista de casas del usuario 
    res.status(200).json(userHomes);
})

// Endpoint para eliminar una casa
app.delete("/api/homes/:id", (req, res) => {
  // Obtenemos el id del objeto (casa) a elimar
  const homeId = parseInt(req.params.id);

  // Realizamos la valizacion para saber si el objeto (casa) existe
  if (isNaN(homeId)) {
    // si no existe retornamos un status 404 (Not Found)
    return res.status(400).json({ error: "ID invalido para eliminar" });
  }

  // Buscamos la casa en el array de datos
  const homeIndex = data.findIndex((home) => home.id === homeId);

  // Si la casa no existe retornamos un status 404 (Not Found)
  if (homeIndex === -1) {
    return res.status(404).json({ error: "Casa no encontrada" });
  }
  // Eliminamos el objeto (casa) del array de tatos
  const deleteHome = data.splice(homeIndex, 1)[0];

  // Guardamos el nuevo array de datos en el archivo 'data.json
  fs.writeFile("./data.json", JSON.stringify(data, null, 2), (error) => {
    // Si llega a ocurrir un error
    if (error) {
      console.log("Err0r al guardar los datos", error);
      // Mandamos una respuesta con un 500 (Internal Server Error)
      return res.status(500).json({ error: "Error al guardar los datos" });
    }
    // Si todo sale bien respondemos con 200 (OK) y la casa fue eliminada correctamente
    res
      .status(200)
      .json({ message: "Casa eliminada correctamente", deleteHome });
  });
});

// Endpoint para actualizar un objeto (Casa) atravez de su ID
app.put('/api/homes/:id', (req, res)=>{
    // obtenemos el id del Objeto /(Casa) a actualizar
    const homeId = parseInt(req.params.id);
    // Realizamos una validacion para saber si el ID es valido
    if(isNaN(homeId)){
        return res.status(400).json({error: 'ID invalido para actualizar'});
    }
    // Buscamos el objeto (Casa a actualizar)) en el array de datos
    const homeIndex = data.findIndex((home)=> home.id === homeId);

    // Si la casa no existe retornamos un 404(Not Found) 
    if(homeIndex === -1){
        return res.status(404).json({error: 'Casa no emcontrada'});
    }

    // Obtenemos los nuevos datos del objeto (casa) a actualiza
    const {title, price, location, bedrooms, bathrooms, square_feet, image} = req.body;

    // Validamos que almenos un campo sea enviado para actualizar
    if(!title && !price && !location && !bedrooms && !bathrooms && !square_feet && !image){
        // Si no se envia ningun campo retornamos uin 400 (Bad Request)
        return res.status(400).json({error: 'Proporcione almenos un campo'});
    }

    /*Nota: Spread operator lo utilizamos para expandir elementos de un iterable como un array o un objeto
        en este caso especifico: creamos un nuevo objeto llamado 'updatedHome'
        ...data[homeIndex]:
            data[homeIndex] es un objeto dentro del array data
            ...data[homeIndex] copia todas las propiedades de ese objeto al nuevo
        por otro lado 
        ...req.body:
            req.body contiene los datos enviados por la peticion HTTP(PUT)
            ...req.body copia todas las propiedades y las sobre escribe en caso de que
            tengan el mismo nombre que alguna en data[homeIndex]
            DOC: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
            DOC: https://expressjs.com/en/resources/middleware/body-parser.html?utm_source=chatgpt.com
            */

    // Actualizamos solo los datos enviados por el cliente en el body
    const updatedHome = {...data[homeIndex], ...req.body};

    // POR LO TANTO ESTE OBJETO SERA REMPLAZADO EN EL ARRAY DE DATOS
    data[homeIndex] = updatedHome;

    // Y guardamos los datos actualizados en el archivo correspondiente data.jsom
    fs.writeFile('./data.json', JSON.stringify(data, null, 2), (error)=>{
        // validamos si ocurre un error al guardar los datos
        if(error){
            console.error('error al guardar los datos', error )
            //retornamos un 500 error al guardar los datos
            return res.status(500).json({message: 'Error al guardar los datos'})
        }
        // Si todo sale bien enviamos un 200 en la respuesta con un msj y los datos de la casa actualizada
        return res.status(200).json({message: 'Casa actualizada correctamente', updatedHome})
    })
})

app.listen(PORT, () => {
  console.log(` API de SmatHouse corriendo en http://localhost:${PORT} `);
});
