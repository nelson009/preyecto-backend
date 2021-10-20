const express = require("express")
const faker = require("faker")
const Carrito = require("./carrito");
const { Memoria,Fecha} = require("./src/daos/memoria")
const session = require('express-session')
 
const  handlebars   =  require ( 'express-handlebars' )
const http = require("http");
const io = require("socket.io");
const DaoFactory = require("./src/daoFactory");
const app = express()
const port = 8080;

const server = http.Server(app);
const ioServer = io(server);
const carritoRouter = express.Router();
const productoRouter = express.Router();
const carrito = new Carrito()

const MEMORIA = 0;
const MYSQL = 1;
const MONGODB = 2;
const MONGODBAASDOO = 3;
const FIREBASEDAO = 4;
const SQLITE3DAO = 5;
const FSDAO = 6
const OPTION = MEMORIA
const dapFactory = new DaoFactory()
const dao = dapFactory.getDao(OPTION)
const sessionHandler = session(
    {
        secret: 'secreto',
        resave: true,
        saveUninitialized: true,
    }
)
let isAdmin = true || false

app.use(sessionHandler);
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

// SOCKET
 ioServer.on("connection", async (socket) => {
    console.log('se conecto en el backen');
    socket.emit('cargarProductos', await dao.readProduct())

    // socket.emit("messages", messages)
    socket.emit("messages", await dao.leerMensages())
    
    //filtros
    socket.emit('lista', await dao.filtroNombre())
    socket.emit('rango', await dao.filtroPrecio())
    socket.emit('code', await dao.filtroCodigo())
    socket.emit('listaStock', await dao.filterStock())

    socket.on("new-message",async (data) => {
        // messages.push(data);
        // ioServer.sockets.emit("messages",messages);
        await dao.creatMessage(data)
        ioServer.sockets.emit("messages", await dao.leerMensages());
       
    })
    //filtros
    socket.on("Name", async (data) => {
        ioServer.sockets.emit("lista",await dao.filtroNombre(data))
    })
    socket.on("precio", async (data) => {
        ioServer.sockets.emit("rango",await dao.filtroPrecio(data))
    })
    socket.on("inputCode", async(data)=>{
        ioServer.sockets.emit("code",await dao.filtroCodigo(data))
    })
    socket.on("Stock", async (data) => {
        ioServer.sockets.emit("listaStock",await dao.filterStock(data))
    })
})

//RUTAS PRODUCTOS

productoRouter.get("/listar/:id?",async (req,res) => {
    const { id } =  (req.params)
    if(id){
    
        return res.status(200).send(await dao.getProductById(id))
    }

    res.status(200).send(await dao.readProduct());
    
})

productoRouter.post("/guardar", async(req,res) =>{
    if(!isAdmin){
        const error = {error:1,descripcion:`/carrito/agregar post no autorizada`}
        res.status(200).send(error)
        return
    }
    const  producto  = req.body 
    console.log(producto.precio , producto.title , producto.thumbnail,producto.codigo,producto.stock);
    // if(producto.precio && producto.title && producto.thumbnail&producto.descripcion){
        dao.creatProduct({...producto,timestamp:Fecha()})
        ioServer.sockets.emit('cargarProductos',await dao.readProduct());
        
        res.redirect('/')
    // }
})

productoRouter.put("/actualizar/:id", (req,res) =>{
    if(!isAdmin){
        const error = {error:1,descripcion:`/carrito/listar get no autorizada`}
        res.status(200).send(error)
        return
    }
    const { id } = req.params
    const ProductoActualizado = req.body
    if(ProductoActualizado.title&&ProductoActualizado.precio&&ProductoActualizado.thumbnail){
        res.status(200).send(dao.update((ProductoActualizado),id))
    }
})

productoRouter.delete("/borrar/:id", (req,res) =>{
    if(!isAdmin){
        const error = {error:1,descripcion:`/carrito/listar get no autorizada`}
        res.status(200).send(error)
        return 
    }
    const { id } = req.params
    res.status(200).send( dao.delete(id)) 
})

//RUTA LOGIN
app.get("/login",(req,res) => {
    // res.sendFile(__dirname + '/public/index.html');
    res.sendFile(__dirname + '/public/formularioIngreso.html');
})

//RUTA PRODUCTO VISTA
productoRouter.get("/vista", async(req,res) => {
    const arrayProducts = await dao.readProduct()
    res.render("main.hbs", {arrayProducts:arrayProducts})
})

//RUTA PRODUCTO VISTA-TEST
faker.locale = "es"
productoRouter.get("/vista-test", ( req, res) => {
    const arrayProducts = [];
    
    const cant = Number(req.query.cant)
    const cantidadGenerada = isNaN(cant) ? 10 : cant 

    for (let i = 0; i < cantidadGenerada; i ++) {
        arrayProducts.push({
            title: faker.vehicle.vehicle(),
            precio: faker.finance.amount(),
            thumbnail: faker.image.transport()
        })
    }
    res.render("main.hbs", {arrayProducts})
})


//RUTAS CARRITO
carritoRouter.get("/listar/:id?", async(req,res) => {
    const { id } =  (req.params)
    // if(!isNaN(id)){
    if(id){
    
        return res.status(200).send(await carrito.getCarritoById(id))
    }

    res.status(200).send(await carrito.getCarrito());
})

carritoRouter.post("/agregar/:id", async (req,res) => {
    // if(isAdmin){
    const {id} = req.params
    const result = await dao.getProductById(id)
    if(result){
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


 