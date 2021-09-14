const Archivo = require("./archivo")
const Fecha = () => {
    const hoy = new Date()
    let dia= hoy.getDate();
    let mes = hoy.getMonth() + 1;
    let año = hoy.getFullYear();
    dia = ('0' + dia).slice(-2);
    mes = ('0' + mes).slice(-2);
    let hora = hoy.getHours();
    let minutos = hoy.getMinutes();
    let segundos = hoy.getSeconds();
    const fecha = `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`
    return fecha
}
const archivo = new Archivo()
  class Memoria {
    constructor() {
        this.productos = [];
        this.count = 0
      
    }
    getProduct(){
        return this.productos
    }
    getProductById(id){
        const result = this.productos.find(elemento => elemento.id === +id) 
        return result
    }
    addProduct(producto){
        this.productos.push({...producto,id:this.count+1,timestamp:Fecha()});
        this.count++
        archivo.escribirArchivo("./archivostxt/productos.txt",this.productos)
        return producto
    }
    updateProduct(ProductoActualizado,id){
        const indexProducto = this.productos.findIndex(elemento => elemento.id === +id)
        return this.productos[indexProducto] = {...ProductoActualizado, id: +id}
    }
    deleteProduct(id,productDelete){
        const result = this.productos.filter(elemento => elemento.id !== parseInt(id) )
        this.productos = result
        return productDelete
    }
}

module.exports = {Memoria,Fecha}


