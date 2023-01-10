const express = require('express')
require('dotenv').config();
const cors = require('cors')
const { dbConnection } = require('./database/config')
//Crear servidor de express
const app = express()

dbConnection()

app.use(cors())


app.use(express.static('public'))
app.use(express.json())
// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

//lectura y parseo


//Public


// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${3001}`);
})
