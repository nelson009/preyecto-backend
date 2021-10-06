// const Archivo = require("./mysqlDbDao")
const fs = require("fs");
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
// const archivo = new Archivo()
  class Memoria {
    constructor() {
        this.productos = [];
        this.count = 0
        
    }
    readProduct(){
        return this.productos
    }
    getProductById(id){
        const result = this.productos.find(elemento => elemento.id === +id) 
        return result
    }
    creatProduct(producto){
        this.productos.push({...producto,id:this.count+1});
        this.count++
        return producto
    }
    update(ProductoActualizado,id){
        const indexProducto = this.productos.findIndex(elemento => elemento.id === +id)
        return this.productos[indexProducto] = {...ProductoActualizado, id: +id}
    }
    delete(id){
        const result = this.productos.filter(elemento => elemento.id !== parseInt(id) )
        this.productos = result
        return result 
    }
    creatMessage(datos){
        fs.writeFile("./archivostxt/mensajes.txt",JSON.stringify(datos,null,"\t"), (error) => {
            if (error) {
              console.log(`Hubo un error:\n    ${error.message}`);
            } else {
              console.log("Archivo grabado!");
            }
        });
    }
}
module.exports = {Memoria,Fecha}


