require('dotenv').config()
const mongoose = require("mongoose")
const express = require("express")

/*
* Modelos -> Collecion
* Schemas -> documento de esa collection
*/

// App
const app = express()

// Middlewares
app.use(express.json())


// Destructuracion
// Variables de entorno
const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME
}  = process.env

// Schemas de mongo
const koderSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  },
  modulo: {
    type: String
  },
  edad: {
    type: Number,
    min: 18,
    max: 150
  },
  generacion: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
    enum: ["f", "m", "o"]
  }
})

// Modelos -> Collection
const Koder = mongoose.model("koders", koderSchema)

// URL
const URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}${DB_NAME}`

// Endpoints
app.post("/koders", async (request, response) => {
  // Destructurandp
  const { body } = request

  console.log("body", body)
  try {
    // Accedemos a la bd -> Promesa
    const koder = await Koder.create(body)
    response.status(201)
    response.json({
      success: true,
      data: {
        koder
      }
    })

  }catch(error) {
    console.log("error", error)
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }
})

app.get("/koders", async (request, response) => {
  // Destructurandp
  const { query } = request
 console.log("query", query) 

  try {
    const koders = await Koder.find(query)
    response.status(200)
    response.json({
      success: true,
      data: {
        koders
      }
    })
  }catch(error){
    response.status(400)
    response.json({
      success:false,
      message: error.message
    })
  }

})

app.get("/koders/:id", async (request, response)=>{
  console.log("entra")
  const {  params } = request 
  try{
      const koder = await Koder.findById(params.id);
      if(!koder){
          response.status(404); 
          data.success = false;
      }
      response.status(200);
      response.json(data);
  
  }catch(error){
      console.log("error", error)
      response.status(404)
      response.json({
          success: false,
          message: error.menssage
      })
  }
})

// Actualizar un koder
app.patch("/koders/:id", async (request, response) => {
  // Destructurando 
  const { params, body } = request

  try {
    const koder = await Koder.findByIdAndUpdate(params.id, body, { returnDocument: "after" })
  
    response.json({
      success: true,
      data: {
        koder
      }
    })
  }catch (error) {
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }
})

// Eliminar un koder
app.delete("/koders/:id", async (request, response) => {
  const { params } = request

  try {
    const koder = await Koder.findByIdAndDelete(params.id)
    response.json({
      success: true,
      message: "El koder fue eliminado"
    })
  } catch(error) {
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }

})
// Quiero filtrar como filtre en compass. modulo, generacion
// Query params

/**
 * findByIdAndUpdate 
 * Endpoint donde le pasen id
 * Actualizar Koder
 */ 

// Conectando a la base de datos
mongoose.connect(URL)
.then(() => {
  console.log("Conectado a la base de datos de mongo")

  // Levantando el servidor
  app.listen(8080, () => {
    console.log("Server listening...")
  })
})
.catch((error) => {
  console.log("errore", error)
})