import express, {Request, Response} from "express"
import path from "path";
import {Memoria} from "./classmemoria.js"
import handlebars from "express-handlebars"
import * as socketIo from 'socket.io'
import fs from "fs";
import http from "http"

const __dirname = path.resolve()
const app = express()
const port = 8080;
const memoria = new Memoria()

const productoRouter = express.Router();
const server = http.createServer(app)
const io = new socketIo.Server(server)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`))
app.use('/api', productoRouter)

app.set("views", "./views");
app.set("view engine","hbs");
app.engine(
    "hbs",
    handlebars({
        extname: "hbs",
        layoutsDir: `${__dirname}/views/layouts`,
        partialsDir: __dirname + '/views/partials/',
        defaultLayout: "index.hbs",
    })
);

interface Message{
    email:string;
    fecha:string;
    texto:string;
}
const messages :Array<Message>= []

server.listen(port,(error?: Error) => {
    if (error) {
        throw Error(`Error inicando el servidor: ${error}`);
    }
   console.log(`El servidor es escuchando en el port ${port}`);
})


productoRouter.get("/productos/listar", (req:Request,res:Response) => {
    const result = memoria.getProduct()
    if(result.length > 0){
        // res.status(200).send(JSON.stringify(result))
        res.status(200).send(result)
        return
    }
    res.status(404).send({error:"no hay productos cargados"})
    
})

productoRouter.get("/productos/listar/:id", (req:Request,res:Response) => {
    const { id }:any= req.params
    const result = memoria.getProductById(id)
    if(result){
        res.status(200).send(JSON.stringify(result))
        return
    }
    res.status(404).send({error:"producto no encontrado"})
})

productoRouter.post("/productos/guardar", (req:Request,res:Response) =>{
    const  producto  = req.body 
    console.log(producto.precio , producto.title , producto.thumbnail);
    if(producto.precio && producto.title && producto.thumbnail){
        memoria.addProduct(producto)
        const arrayProducts = memoria.getProduct()

        io.sockets.emit('cargarProductos',arrayProducts);
        res.redirect('/')
       
        return
    } 
    res.status(404).send({error:"informacion incompleta"})
})

productoRouter.put("/productos/actualizar/:id", (req:Request,res:Response) =>{
    const { id }:any = req.params
    const ProductoActualizado = req.body
    const productoExistente = memoria.getProductById(id)
    if(ProductoActualizado.title&&ProductoActualizado.precio&&ProductoActualizado.thumbnail&&productoExistente){
        res.status(200).send(memoria.updateProduct((ProductoActualizado),id))
        return
    }
    res.status(404).send({error:"producto no encontrado, no se puede actualizar"})
    
})

productoRouter.delete("/productos/borrar/:id", (req:Request,res:Response) =>{
    const { id } :any= req.params
    const productDelete = memoria.getProductById(id)
    if(productDelete){
        res.status(200).send( memoria.deleteProduct(id,productDelete)) 
        return 
    }
    res.status(404).send({error:"producto no encontrado, no se puede borrar"})
    
})

app.get("/",(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
})

productoRouter.get("/productos/vista", (req:Request,res:Response) => {
    const arrayProducts = memoria.getProduct()
    let bolean=
    arrayProducts.length > 0? true : false
    res.render("main.hbs", {
        listExists: bolean,
        arrayProducts,
    })
})

io.on("connection", socket => {
    const arrayProducts = memoria.getProduct()
    console.log('se conecto en el backen');
    socket.emit('cargarProductos', arrayProducts)
    socket.emit("messages", messages)

    socket.on("new-message", (data) => {
        messages.push(data);
        io.sockets.emit("messages",messages);
        fs.writeFile("./registro.txt",JSON.stringify(messages,null,"\t"), (error) => {
            if (error) {
              console.log(`Hubo un error:\n    ${error.message}`);
            } else {
              console.log("Archivo grabado!");
            }
        });
    })
})
