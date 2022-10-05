
require('dotenv').config()
const mongoose = require("mongoose")
const express = require("express")

//App
const app = express()

//Midleware 
app.use(express.json())


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

// Modelos -> Collection // se ponen en mayusculas 
const Koder = mongoose.model("koders", koderSchema)

//&Endpoints

//&1. crear koders
app.post("/koders", async (request, response)=>{
  const {body} = request // si estamos en body tenemos que mandar un json en insomnia

  //console.log("body",body) -> nos manda undefined por que necesitamos el midleware 

  try{
     //Accedemos a la BD
    const koder = await Koder.create(body)
    console.log("koder", koder)
    response.status(201)
    response.json({
      success: true,
      data: {
        koder
      }
    })
  }catch(error){
    console.log("error", error)
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }

 
})

//&Enpoint para filtrar koders 
app.get("/koders", async (request, response)=>{
  const {query} = request // si estamos en body tenemos que mandar un json en insomnia

  console.log("query", query)

  try{
     //Accedemos a la BD
    const koders = await Koder.find(query)
   
    response.status(201)
    response.json({
      success: true,
      data: {
        koders
      }
    })
  }catch(error){
    console.log("error", error)
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }

 
})

//&Actualizar koders 
app.patch("/koders/:id", async (request, response)=>{
  const {params, body} = request // si estamos en body tenemos que mandar un json en insomnia

  console.log("id", params.id)
  console.log("body", body)
    try{
  //options.returnDocument="before"
  const updateKoder = await Koder.findByIdAndUpdate(params.id, body, {returnDocument: "after"})
  console.log("koder actualizado", updateKoder)

  response.json({
    success: true,
    data: {
      updateKoder
    }
  })
    }catch(error){
      response.status(400)
      response.json({
        success: false,
        message: error.message
      })
    }
 
})

//&Eliminar koders 
app.delete("/koders/:id", async (request, response)=>{
  const {params} = request

  try{

    const koder = await Koder.findByIdAndDelete(params.id)
    console.log("koder", koder)
    response.json({
    success: true,
    message: "Koder eliminado"
  })

  }catch(error){
    response.status(400)
    response.json({
      success: false,
      message: error.message
    })
  }
  
})


//Destructuracion 
const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME
}  = process.env

/*console.log(DB_USERNAME)
console.log(DB_PASSWORD)
console.log(DB_HOST)
console.log(DB_NAME)*/

const URL =`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}${DB_NAME}`

//Conectar a la BD de mongo 
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