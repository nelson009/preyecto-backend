const mongoose = require("mongoose");
const {mensajes,productos} = require("./mongoSchema");

class Mongo {
    constructor(){
       
    }

    baseDatosProduct(producto){
        mongoose.connect("mongodb://localhost:27017/ecommerce", () => {
            console.log("base de datos conectada");
            productos.insertMany(producto,(error, docs) => {
                if (error) {
                    console.log(error);
                }
                console.log(docs);
                mongoose.disconnect(() => {
                console.log("Base de datos desconectada");
                })
            })
        })   
    }
    
    baseDatos(message){
        mongoose.connect("mongodb://localhost:27017/ecommerce", () => {
            console.log("base de datos conectada");
            mensajes.insertMany(message,(error, docs) => {
                if (error) {
                    console.log(error);
                }
                console.log(docs);
                mongoose.disconnect(() => {
                console.log("Base de datos desconectada");
                })
            })
        })
    }
    async deleteProduct(precio){
        try {
            await mongoose.connect("mongodb://localhost:27017/ecommerce");
            console.log("Base de datos conectada");
            console.log(
                "producto borrado",
                await productos.deleteMany({ precio : precio })
            );
        } catch (error) {
            console.log(error);
        } finally {
            await mongoose.disconnect();
            console.log("Base de datos desconectada");
          }
    }
}

module.exports = Mongo