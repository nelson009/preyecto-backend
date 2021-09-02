import express from "express"
import path from "path";
import {Memoria} from "./classmemoria.mjs"

const app = express()
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(port,() => {
    console.log(`El servidor es escuchando en el puest ${port}`);
})

server.on("error",(error)=>{
    console.error(error);
})

const productoRouter = express.Router();
app.use('/api', productoRouter)

const __dirname = path.resolve()
app.use(express.static(`${__dirname}/public`))

const memoria = new Memoria()

productoRouter.get("/productos/listar", (req,res) => {
    const result = memoria.getProduct()
    if(result.length > 0){
        // res.status(200).send(JSON.stringify(result))
        res.status(200).send(result)
        return
    }
    res.status(404).send({error:"no hay productos cargados"})
    
})

productoRouter.get("/productos/listar/:id", (req,res) => {
    const { id } = req.params
    const result = memoria.getProductById(id)
    if(result){
        res.status(200).send(JSON.stringify(result))
        return
    }
    res.status(404).send({error:"producto no encontrado"})
})

productoRouter.post("/productos/guardar", (req,res) =>{
    
    const  producto  = req.body 
    console.log(producto.precio , producto.title , producto.thumbnail);
    
    if(producto.precio && producto.title && producto.thumbnail){
        memoria.addProduct(producto)
        res.redirect('/')
        return
    } 
    res.status(404).send({error:"informacion incompleta"})
})

productoRouter.put("/productos/actualizar/:id", (req,res) =>{
    const { id } = req.params
    const ProductoActualizado = req.body
    const productoExistente = memoria.getProductById(id)
    if(ProductoActualizado.title&&ProductoActualizado.precio&&ProductoActualizado.thumbnail&&productoExistente){
        res.status(200).send(memoria.updateProduct((ProductoActualizado),id))
        return
    }
    res.status(404).send({error:"producto no encontrado, no se puede actualizar"})
    
})

productoRouter.delete("/productos/borrar/:id", (req,res) =>{
    const { id } = req.params
    const productDelete = memoria.getProductById(id)
    if(productDelete){
        res.status(200).send( memoria.deleteProduct(id,productDelete)) 
        return 
    }
    res.status(404).send({error:"producto no encontrado, no se puede borrar"})
    
})

app.set("views", `${__dirname}/views`)
app.set("view engine", "pug")

productoRouter.get("/productos/vista", (req,res) =>{
    const arrayProducts = memoria.getProduct()
    res.render("pages/index.pug", {arrayProducts})
})
