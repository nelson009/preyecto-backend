
const { error } = require("console");
const fs = require("fs");
const { dirname } = require("path");
const FsDao = require("./src/daos/fsDao");
const {Fecha} = require("./src/daos/memoria")
const fsDao = new FsDao()
class Carrito {
    constructor() {
        this.carrito = {
            id:1,
            productos:[],
            timestamp:Fecha(),
        };
        this.count = 0
        this.fileName = "./archivostxt/carrito.txt"
        this.productoGet=[]
    }

    getCarrito() {
        try{
            let result =  fs.readFileSync(this.fileName, 'utf-8');
            this.productoGet = JSON.parse(result);  
        }catch(error){
            console.log(error);
        }
      
        return  this.productoGet 
    }

    getCarritoById(id) {
        let getId = this.getCarrito()
        const result=  getId.productos.find(elemento => elemento.id == id) 
        return result
    }

    addCarrito(product) {
        if( this.productoGet.length !== 0){
            let result = this.getCarrito()
            this.carrito = result
            this.carrito.productos.push(product)
            fsDao.escribirArchivo(this.fileName ,this.carrito)
     
        }else{
            this.carrito.productos.push(product)
            fsDao.escribirArchivo(this.fileName ,this.carrito)
        }
         
        return this.carrito
    }   

    deleteCarrito(id) {
        const result=this.getCarrito()
        this.productoGet.productos = result.productos.filter( elemento => elemento.id != id)
        fsDao.escribirArchivo(this.fileName ,this.productoGet)
      
        return this.productoGet
    }
}
module.exports = Carrito