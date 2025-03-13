//Datos de los usuarios 
const fs = require("fs");
const path = require("path") // manejar rutas de archivos
const bcrypt = require("bcrypt"); //encripta & compara el password

// Definimos una ruta donde se guardaran los usuario
const usersPathFile = path.join(__dirname, "../data/users.json");

// funcion para cargar los usuarios desde el archivo Json
const loadUsers = () =>{
    if(!fs.existsSync(usersPathFile)) // Si el usuario existe retornamos un array vacio 
        return [];
    const data = fs.readFileSync(usersPathFile, 'utf8');
        return data ? JSON.parse(data):[];
}

// F: guarda los usuarios en el archivo
const saveUsers = (users) =>{
    fs.writeFileSync(usersPathFile, JSON.stringify(users, null, 2), "utf8")
}

const User = {
// Obtenemos todos los usuarios
getAll: () => loadUsers(),

// Buscamos un usuario por email
findByEmail: (email)=> loadUsers().find((user) => user.email === email),

// Creamos un nuevo usuario con ID unico
create: async (newUser) =>{
    const users = loadUsers(); // cargamos los usuarios actuales

    // asignamos un id unico basandonos en el ultimo registro
    newUser.id = users.length > 0 ? users[users.length -1].id +1 : 1;
    
    newUser.password = await bcrypt.hash(newUser.password, 10)
    // agregamos el nuevo usuario
    users.push(newUser);
    // guardamos la actualizacion en el JSON
    saveUsers(users);

    return newUser;
},
authenticate: async (email, password)=>{
    const user = User.findByEmail(email);
    if(!user) return null;

    // Comparamos la contraseña ingresada con la guardada
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user: null;
}
};
// Exportamos el modelo para poder hacer uso del mismo
module.exports = User