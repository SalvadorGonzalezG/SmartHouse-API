// Config  rutas que llamaran a las funcioones del controller
const express = require("express");
const {getAllUsers, getUserByEmail, createUser} = require("../controllers/usersController")

const router = express.Router();

// ruta para obtener todos los usuarios
router.get("/users", getAllUsers)

//ruta para obtener un usuario por email
router.get("/users/:email", getUserByEmail);

//ruta para crear un nuevo usuario
router.post("/users", createUser);

module.exports = router;