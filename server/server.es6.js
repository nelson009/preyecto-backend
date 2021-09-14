const express = require("express")
const Carrito = require("./carrito");
const { Memoria} = require("./memoria.js")
const Archivo = require("./archivo")

const  handlebars   =  require ( 'express-handlebars' )
const http = require("http");
const io = require("socket.io");
const fs = require("fs");
const app = express()
const port = 8080;
const messages= []
const server = http.Server(app);
const ioServer = io(server);
const carritoRouter = express.Router();
const productoRouter = express.Router();
const memoria = new Memoria()
const archivo = new Archivo()
const carrito = new Carrito()
let isAdmin = true || false

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`))
app.use('/productos', productoRouter)
app.use('/carrito',carritoRouter)

app.set("views", "./views");
app.set("view engine", "hbs");
app.engine(
    "hbs",
    handlebars({
        extname: "hbs",
        layoutsDir: `${__dirname}/views/layouts`,
        partialsDir: __dirname + '/views/partials/',
        defaultLayout: "index.hbs",
    })
);

server.on("error",(error)=>{
    if (error) {
        throw Error(`Error inicando el servidor: ${error}`);
    }
})
server.listen(port,() => {
   console.log(`El servidor es escuchando en el port ${port}`);
})

ioServer.on("connection", socket => {
    const arrayProducts = memoria.getProduct()
    console.log('se conecto en el backen');
    socket.emit('cargarProductos', arrayProducts)
    socket.emit("messages", messages)

    socket.on("new-message", (data) => {
        messages.push(data);
        ioServer.sockets.emit("messages",messages);
        archivo.escribirArchivo("./archivostxt/mensages.txt",messages)
    })
})

productoRouter.get("/listar", (req,res) => {
    if(isAdmin){
        const result = memoria.getProduct()
        if(result.length > 0){
            // res.status(200).send(JSON.stringify(result))
            res.status(200).send(result)
            return
        }
    }
    res.status(404).send({error:"no hay productos cargados"})
    
})

productoRouter.get("/listar/:id", (req,res) => {
    if(isAdmin){
        const { id } = req.params
        const result = memoria.getProductById(id)
        if(result){
            res.status(200).send(JSON.stringify(result))
            return
        }
    }
    res.status(404).send({error:"producto no encontrado"})
})

productoRouter.post("/guardar", (req,res) =>{
    if(!isAdmin){
        const error = {error:1,descripcion:`/carrito/agregar post no autorizada`}
        res.status(200).send(error)
        return
    }
    const  producto  = req.body 
    console.log(producto.precio , producto.title , producto.thumbnail,producto.codigo,producto.stock);
    if(producto.precio && producto.title && producto.thumbnail){
        memoria.addProduct(producto)
        const arrayProducts = memoria.getProduct()

        ioServer.sockets.emit('cargarProductos',arrayProducts);
        res.redirect('/')
    }
})

productoRouter.put("/actualizar/:id", (req,res) =>{
    if(!isAdmin){
        const error = {error:1,descripcion:`/carrito/listar get no autorizada`}
        res.status(200).send(error)
        return
    }
    const { id } = req.params
    const ProductoActualizado = req.body
    const productoExistente = memoria.getProductById(id)
    if(ProductoActualizado.title&&ProductoActualizado.precio&&ProductoActualizado.thumbnail&&productoExistente){
        res.status(200).send(memoria.updateProduct((ProductoActualizado),id))
    }
})

productoRouter.delete("/borrar/:id", (req,res) =>{
    if(isAdmin){
        const error = {error:1,descripcion:`/carrito/listar get no autorizada`}
        res.status(200).send(error)
        return 
    }
    const { id } = req.params
    const productDelete = memoria.getProductById(id)
    if(productDelete){
        res.status(200).send( memoria.deleteProduct(id,productDelete)) 
    }
})

app.get("/",(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
})

productoRouter.get("/vista", (req,res) => {
    const arrayProducts = memoria.getProduct()
    let bolean=
    arrayProducts.length > 0? true : false
    res.render("main.hbs", {
        listExists: bolean,
        arrayProducts,
    })
})

carritoRouter.get("/listar", (req,res) => {
   if(isAdmin){
        res.status(200).send(carrito.getCarrito());
        return
   }
       const error = {error:1,descripcion:`/carrito/listar get no autorizada`}
       res.status(200).send(error)
   
})

carritoRouter.post("/agregar/:id", (req,res) => {
    if(isAdmin){
        const {id} = req.params
        const result = memoria.getProductById(id)
        res.status(200).send(carrito.addCarrito(result))
        return
    }
        const error = {error:1,descripcion:`/carrito/agregar post no autorizada`}
        res.status(200).send(error)
})

carritoRouter.delete("/borrar/:id", (req,res) =>{
    if(isAdmin){
        const {id} = req.params 
        res.status(200).send(carrito.deleteCarrito(id))
        return
    }
    const error = {error:1,descripcion:`/carrito/borrar/:id delete no autorizada`}
    res.status(200).send(error)
})