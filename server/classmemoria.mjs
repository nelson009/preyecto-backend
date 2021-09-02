export class Memoria {
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
        this.productos.push({...producto,id:this.count+1});
        this.count++
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