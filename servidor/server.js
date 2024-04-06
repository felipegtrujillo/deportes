const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require("uuid");

const PORT = 3000;

const deportes = []; /* para guardar mis deportes previamente y luego grabar en el json */
const directorioActual = __dirname;
const nombreArchivo = 'deportes.json';
const rutaCompleta = path.join(directorioActual, nombreArchivo);

/* STATIC */
app.use(express.json());
app.use(cors());

/* MIDDLEWARES */

// Middleware para chequear que el archivo exista o no, y si existe carga un string con su data para ser usado en las rutas
const checkFile = (req, res, next) => {
  // Verifica si el archivo existe
  if (fs.existsSync(rutaCompleta)) {
    console.log('El archivo existe en la siguiente ruta:', rutaCompleta);
    req.dataArchivo= fs.readFileSync(rutaCompleta, 'utf8');
    console.log("leo mi archivo existente:", req.dataArchivo);
    req.archivoExiste = true;
  } else {
    console.error('El archivo no existe');
    req.archivoExiste = false;
  }
  next(); // Llama a la siguiente función en la cadena de middleware
};

app.post("/agregarDeporte",checkFile, (req, res) => {
  try {
    console.log("Entro la peticion");

    let id = uuidv4().substring(0,8);
    let nombre = req.body.nombre;
    let precio = req.body.precio;

    /* primero verifico si el archivo esta creado o no */
   /* si no esta creado lo Creo */
    if (!req.archivoExiste) { 
    console.log("entro a crear el archivo")
    deportes.push({ id, nombre , precio });
    // Cargar el deporte y precio al archivo json
    fs.writeFileSync('deportes.json', JSON.stringify(deportes));
    return res.status(200).json({status: "ok"})
    } else {  /* si ya esta creado lo Leo y vuelvo a sobrescribir */
      // Convertir el contenido del archivo a un objeto JavaScript
      deportes.push(...JSON.parse(req.dataArchivo));
      deportes.push({ id, nombre, precio });

      // Escribir el archivo actualizado
      fs.writeFileSync(rutaCompleta, JSON.stringify(deportes));
      return res.status(200).json({status: "ok"});

    }

  } catch (error) {
    return res.status(500).json({ status: "error", error: error });
  }
});

app.get("/consultaDeportes",checkFile, (req, res) => {
  
  if(req.archivoExiste) {
  console.log("leo mi archivo existente:", req.dataArchivo);
  return res.status(200).json({status: "ok", response: req.dataArchivo});
  }
  else{
    return res.status(400).json({status: "error", response: "no existen registros"});
  }
  
});

app.put("/editarPrecio",checkFile, (req, res) => {

let idBuscado= req.query.id;
let nombreBuscado = req.query.nombre ;
let nuevoPrecio = req.query.precio ;
const data = JSON.parse(req.dataArchivo); 
try{
  const elemento = data.find(item => item.id === idBuscado);

  if (elemento) {
    elemento.precio = nuevoPrecio;;
    deportes.push(...data);
    // Escribir el archivo actualizado
    fs.writeFileSync(rutaCompleta, JSON.stringify(deportes));
    return res.status(200).json({status:"ok", mensaje: "precio modificado"});
  } else {
    console.log(`No se encontró un elemento con el ID ${idBuscado}`);
    return;
  }

}catch(e){
  return res.status(400).json({status:"error"});
}
  
});

app.delete("/borrarID",checkFile, (req, res) => {
  const idBorrar = req.query.id;
  const lista = JSON.parse(req.dataArchivo);

  try {
    const newLista = lista.filter(objeto => objeto.id !== idBorrar);

    fs.writeFileSync(rutaCompleta, JSON.stringify(newLista));
    return res.status(200).json({status:"ok", mensaje: "borrado correctamente"});
  }

  catch(error) {
    return res.status(400).json({status:"error", error: error});
  }

});

app.get("*", (req, res) => {
  res.send("<h1> Esta Página no exíste <h1>");
});
/* ESCUCHAR EL SERVIDOR*/
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});