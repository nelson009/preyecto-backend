
const FsDao = require("./src/daos/fsDao");
const {Fecha} = require("./src/daos/memoria")
const fsDao = new FsDao()
class Carrito {
    constructor(){
        this.carrito = [];
        this.count = 0
        this.fileName = "./archivostxt/carrito.txt"
    }
    getCarrito(){

        return this.carrito
    }

    getCarritoById(id){
        const result = this.carrito.find(elemento => elemento.id === +id) 
    
        return result
    }

    addCarrito(product){
        this.carrito.push({producto:{...product},id:this.count+1,timestamp:Fecha(),})
        this.count++
        fsDao.escribirArchivo(this.fileName ,this.carrito)

        return this.carrito
    }

    deleteCarrito(id){
        const result = this.carrito.filter( elemento => elemento.id !== +id)

        return this.carrito = result
    }
}
module.exports = Carrito