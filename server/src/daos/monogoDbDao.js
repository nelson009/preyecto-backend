const mongoose = require("mongoose");
const {mensajes,productos} = require("./mongoSchema");

class MongoDbDao {
    constructor(){
       this.productos = []
       this.filtroName=[]
        this.codigo = []
        this.stock=[]
        this.precio=[]
    }
    async filtroNombre(nombre){
        await mongoose.connect("mongodb://localhost:27017/ecommerce");
        if(nombre){
            try{
           
                this.filtroName  = await productos.find({ title : nombre})
            }catch (error) {
                console.log(error)
            } 
        }

        return  this.filtroName
      }

    async filtroPrecio(object){
        await mongoose.connect("mongodb://localhost:27017/ecommerce");
        if(object){
            if((object.operador) == "="){
                console.log(object.precio, object.operador)
                this.precio =  await productos.find({ precio: +object.precio})
            }if(object.operador == ">"){
                this.precio =  await productos.find({ precio: { $gt: +object.precio }})
            }if(object.operador == '<'){
                this.precio =  await productos.find({ precio: { $lt: +object.precio }})
            }
        }
       
        return this.precio
    }

    async filtroCodigo(codigo){
        if(codigo){
            try{
                await mongoose.connect("mongodb://localhost:27017/ecommerce");
                this.codigo  = await productos.find({ codigo : codigo})
            }catch (error) {
                console.log(error)
            } 
        }

        return this.codigo
    }

    async filterStock(object){
        await mongoose.connect("mongodb://localhost:27017/ecommerce");
        if(object){
            if((object.operador) == '='){
                console.log(object.stock, object.operador)
                this.stock =  await productos.find({ stock: +object.stock})
            }if(object.operador == '>'){
                this.stock =  await productos.find({ stock: { $gt: +object.stock }})
            }if(object.operador == '<'){
                this.stock =  await productos.find({ stock: { $lt: +object.stock }})
            }
        }

        return this.stock
    }

    creatProduct(producto){
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

    leerMensages(){
        console.log("leyendo mensajes de memoria", this.mensaje)
        
        return this.mensaje
    }

    async readProduct(){
        try {
            await mongoose.connect("mongodb://localhost:27017/ecommerce");
            console.log("Base de datos conectada");
            const result = await productos.find({}) 
            this.productos = result
        } catch (error) {
            console.log(error);
        }
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