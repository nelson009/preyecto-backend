import express, { json, response } from 'express'
import fs from "fs";

const app = express();
const port = 8080;

const server = app.listen(port, () =>{
    console.log(`servidor listo en el puerto ${port}`);
})

server.on("error", (error) => {
    console.error(error);
})

let visitas1 = 0;
app.get("/items", (request,response) => {
    ++visitas1
  
    fs.readFile("./productos.txt", "utf-8", (err,data) =>{
       
            if (err) {
            console.log(err);
            console.log("no existe el archivo");
            } else {
                let  productos = JSON.parse(data);
                response.json({
                    item: productos,
                    cantidad: productos.length,
                    })
            } 
        }); 
})

const min = 0;
const max = 2
let numero;
let visitas2= 0
app.get("/item-random", (request,response) => {
 
    fs.readFile("./productos.txt", "utf-8", (err,data) =>{
        ++visitas2
        numero = Math.floor(min + Math.random() * (max - min + 1))
            if (err) {
            console.log(err);
            console.log("no existe el archivo");
            } else {
                let  itemAzar = JSON.parse(data);
                response.json({
                    item: itemAzar[numero],
                    })
            } 
        });  
})

app.get("/visitas", (request,response) =>{
    response.json({visitas:{items:visitas1, item: visitas2}

    })
})