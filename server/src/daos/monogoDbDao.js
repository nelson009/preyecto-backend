const mongoose = require("mongoose");
const {mensajes,productos} = require("./mongoSchema");

class MongoDbDao {
    constructor(){
       this.productos = []
    }

    creatProduct(producto){
        mongoose.connect("mongodb://localhost:27017/ecommerce", () => {
            console.log("base de datos conectada");
            productos.insertMany(producto,(error, docs) => {
                if (error) {
                    console.log(error);
                }
                console.log(docs);
                // this.productos.push(producto)
                mongoose.disconnect(() => {
                console.log("Base de datos desconectada");
                })
            })
        })
           
    }
    
    creatMessage(message){
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
    async readProduct(){
     
        try {
            await mongoose.connect("mongodb://localhost:27017/ecommerce");
            console.log("Base de datos conectada");
            let result = await productos.find({}) 
            this.productos = result
         } catch (error) {
            console.log(error);

        } finally {
            await mongoose.disconnect();
            console.log("Base de datos desconectada");
          }
        console.log("mongo class", this.productos);
        return this.productos
    }
    
    async delete(id){
        try {
            await mongoose.connect("mongodb://localhost:27017/ecommerce");
            console.log("Base de datos conectada");
            console.log(
                "producto borrado",
                await productos.deleteMany({ _id : id })
            );
        } catch (error) {
            console.log(error);
        } finally {
            await mongoose.disconnect();
            console.log("Base de datos desconectada");
          }
    }
    async update (producto,id) {
        try{
            await mongoose.connect("mongodb://localhost:27017/ecommerce");
            console.log("Base de datos conectada");
            console.log(
                "producto actualizado",
                await productos.updateOne(
                  { _id: `${id}` },
                  { $set: { title: `${ producto.title}`, 
                  precio: `${ producto.precio}`, 
                  thumbnail: `${ producto.thumbnail}`, 
                  codigo: `${ producto.codigo}`,
                  stock: `${ producto.stock}`} },
                )
            );
        } catch (error) {
            console.log(error)
        } finally {
            await mongoose.disconnect();
            console.log("Base de datos desconectada")
        }
    }
}

module.exports = MongoDbDao