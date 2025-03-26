const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")

// Logica para realizar el login

const SECRET_KEY = "*.sAlVaDor.05"

// f inicio de sesion
const login = async (req, res) =>{
    const {email, password} = req.body;

    //validacion de los datos 
    if(!email || !password){
        return res.json(400).json({error: "Correo & contraseña son obligatorios"})
    }

try {
    // Buscar el usuario en la base de datos
    const user = await userModel.findByEmail(email);
    if(!user){
        return res.status(404).json({error: "401 Credencial incorrecta"})
    }

    //comprobar la contraseña proporcionada con la almacena
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(401).json({error: "Tu contraseña no coincide"})
    }

    //generar un toker con jwt
    const token = await jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: "1h"});

    //DEVOLVER LA RESPUESTA CON UN TOKEN JWT
    res.status(200).json({message: "Inicio de sesion exitoso", token})

} catch (error) {
    console.log(error)
    res.status(500).json({error: "Error in a server"})
}
}

module.exports ={
    login
}