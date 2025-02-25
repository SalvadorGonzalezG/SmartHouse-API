const User = require('../models/userModel')

// f: Obtenemos todos los usuarios
const getAllUsers = async(req, res) =>{
    try {
        // Obteenemos la lista de usuarios desde el modulo
        const users = await User.getAll();
        // obtenemos la respuesta con los usuarios en formato JSON
        res.json(users)
    } catch (error) {
        res.status(500).json({message: "Error al obtener usuarios", error})
    }
}

// f: buscar usuario por su email
const getUserByEmail = async(req, res) =>{
    try {
        const {email} = req.params;
        const user = User.findByEmail(email)
        // Validacion si no encuentra al usuario
        if(!user){
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        // en caso contrario respondemos con el usuario en un json
        res.json(user);
        
    } catch (error) {
        // respuesta manejo de error con un 500 
        res.status(500).json({message: "error al busscar usuario", error})
    }
}

// f: crea un nuevo usario
const createUser = async(req, res)=>{
    try {
        // Extraemos los datos del cuerpo de la solicitud
        const {firstName, lastName, email, password, confirmPassword}  = req.body;
        // realizamos una validacion que todos los campos requeridos hayan sido ingresador
        if(!firstName || !lastName || !email || !password || !confirmPassword){
            // fi no han sido ingresados todos los datos retornamos un 400 con un msj
            return res.status(400).json({message: "Todos los campos son obligatios"})
        }

        // verificamos que las contraseñas coincidan
        if(password != confirmPassword){
            //si no coiciden las contraseñas retornamos un 400 con un msj
            return res.status(400).json({message: "tu contraseña no coicide"})
        }

        // comprobamos si el usuario ya existe
        const existUser = await User.findByEmail(email);
        // si existe retornamos un 400 con un msj
        if(existUser){
            return res.status(400).json({message: "El usuario ya existe"})
        }
        // si existe el usuario creamos el usuario 
        const newUser = await User.create({ firstName, lastName, email, password, confirmPassword});

        // respondemos con un 201 usuario creado
        res.status(201).json(newUser);
    } catch (error) {
        // manejamos el error con un 500 un msj del y el error que se produjo 
        res.status(500).json({message: "Error al crear usuario", error})
    }
}

// exportamos las funciones del controller para que puedan ser usaras en routes
module.exports = {getAllUsers, getUserByEmail, createUser};