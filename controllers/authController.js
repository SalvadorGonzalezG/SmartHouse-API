const bcrypt = require("bcrypt");
const jwt = require("jwt");
const userModel = require("../models/userModel")

// Logica para realizar el login

const SECRET_KEY = "*.sAlVaDor.05"

// f inicio de sesion
const login = (req, res) =>{
    const {email, password} = req.body;

    //validacion de los datos 
    if(!email || !password){
        return res.json(400).json({error: "Correo & contraseña son obligatorio"})
    }
}