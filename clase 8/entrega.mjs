import express from "express"
import path from "path";

const app = express()
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(port,() => {
    console.log(`El servidor es escuchando en el puest ${port}`);
})

server.on("erro",(error)=>{
    console.error(error);
})

const productoRouter = express.Router();
app.use('/api', productoRouter)

const __dirname = path.resolve()
app.use(express.static(`${__dirname}/public`))

class Memoria {
    constructor() {
        this.productos = [];
        this.count = 0
    }
    getProduct(){
        return this.productos
    }
    getProductById(id){
        const result = this.productos.find(elemento => elemento.id == id) 
        return result
    }
    addProduct(producto){
        this.productos.push({...producto,id:this.count+1});
        this.count++
        return producto
    }
    updateProduct(ProductoActualizado,id){
        return this.productos[id-1] = {...ProductoActualizado, id: parseInt(id)}
    }
    deleteProduct(id,productDelete){
        const result = this.productos.filter(elemento => elemento.id !== parseInt(id) )
        this.productos = result
        return productDelete
    }
}
const memoria = new Memoria()

productoRouter.get("/productos/listar", (req,res) => {
    const result = memoria.getProduct()
    if(result.length > 0){
        res.status(200).send(JSON.stringify(result))
    }else{
        res.status(404).send({error:"no hay productos cargados"})
    }
})

productoRouter.get("/productos/listar/:id", (req,res) => {
    const { id } = req.params
    const result = memoria.getProductById(id)
    if(result){
        res.status(200).send(JSON.stringify(result))
    }else{
        res.status(404).send({error:"producto no encontrado"})
    }
})

productoRouter.post("/productos/guardar", (req,res) =>{
    const  producto  = req.body 
    console.log(producto.precio , producto.title , producto.thumbnail);
    if(producto.precio && producto.title && producto.thumbnail){
        memoria.addProduct(producto)
        res.status(200).send(producto)
    }else{
        res.status(404).send({error:"informacion incompleta"})
    }
})

productoRouter.put("/productos/actualizar/:id", (req,res) =>{
    const { id } = req.params
    const ProductoActualizado = req.body
    const productoExistente = memoria.getProductById(id)
    if(ProductoActualizado.title&&ProductoActualizado.precio&&ProductoActualizado.thumbnail&&productoExistente){
        res.status(200).send(memoria.updateProduct((ProductoActualizado),id))
    }else{
        res.status(404).send({error:"producto no encontrado, no se puede actualizar"})
    }
})

productoRouter.delete("/productos/borrar/:id", (req,res) =>{
    const { id } = req.params
    const productDelete = memoria.getProductById(id)
    if(productDelete){
        res.status(200).send( memoria.deleteProduct(id,productDelete))  
    }else{
        res.status(404).send({error:"producto no encontrado, no se puede borrar"})
    }
})