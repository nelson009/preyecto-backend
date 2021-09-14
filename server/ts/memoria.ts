import {Producto} from "./producto.js"

export class Memoria {
    private productos:Array<Producto>;
    private count:number;

    constructor() {
        this.productos = new Array<Producto>();
        this.count = 0;
    }
    getProduct(){
        return this.productos
    }
    getProductById(id:string){
        const result = this.productos.find(elemento => elemento.id === +id) 
        return result
    }
    addProduct(producto:Producto){
        this.productos.push({...producto,id:this.count+1});
        this.count++
        return producto
    }
    updateProduct(ProductoActualizado:Producto,id:string){
        const indexProducto = this.productos.findIndex(elemento => elemento.id === +id)
        return this.productos[indexProducto] = {...ProductoActualizado, id: +id}
    }
    deleteProduct(id:string,productDelete:Producto){
        const result= this.productos.filter((elemento) => elemento.id !== +id )
        this.productos = result
        return productDelete
    }
}
