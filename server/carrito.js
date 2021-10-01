
const {Fecha} = require("./memoria")
const Archivo = require("./archivo")
// const archivo = new Archivo()
class Carrito {
    constructor(){
        this.carrito = [];
        this.count = 0
    }
    getCarrito(){
        return this.carrito
    }
    addCarrito(product){
        this.carrito.push({producto:{...product},id:this.count+1,timestamp:Fecha(),})
        this.count++
        return product
    }
    deleteCarrito(id){
        const result = this.carrito.filter( elemento => elemento.id !== +id)
        return this.carrito = result
    }
}
module.exports = Carrito