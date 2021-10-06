const express = require("express")
const Carrito = require("./carrito");
const { Memoria,Fecha} = require("./src/daos/memoria")
const MysqlDao = require("./src/daos/mysqlDbDao")
const MongoDbDao = require("./src/daos/monogoDbDao")
const  handlebars   =  require ( 'express-handlebars' )
const http = require("http");
const io = require("socket.io");
const DaoFactory = require("./src/daoFactory");
const app = express()
const port = 8080;
const messages= []
const server = http.Server(app);
const ioServer = io(server);
const carritoRouter = express.Router();
const productoRouter = express.Router();
const memoria = new Memoria()
const carrito = new Carrito()
const mysqlDao = new MysqlDao()
// const mongoDbDao= new MongoDbDao()
const MEMORIA = 0;
const MYSQL = 1;
const MONGODB = 2;
const MONGODBAASDOO = 3;
const FIREBASEDAO = 4;
const SQLITE3DAO = 5;
const OPTION = MYSQL
const dapFactory = new DaoFactory()
const dao = dapFactory.getDao(OPTION)
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

 ioServer.on("connection", async (socket) => {
    // const arrayProducts = memoria.readProduct()
    console.log('se conecto en el backen');
    socket.emit('cargarProductos', await dao.readProduct())
    socket.emit("messages", messages)
    //filtros
    socket.emit('lista', await dao.filtroNombre())
    socket.emit('rango', await dao.filtroPrecio())

    socket.on("new-message", (data) => {
        messages.push(data);
        ioServer.sockets.emit("messages",messages);
        dao.creatMessage(data)
    })
    //filtros
    socket.on("Name", async (data) => {
        ioServer.sockets.emit("lista",await dao.filtroNombre(data))
    })
    socket.on("precio", async (data) => {
        ioServer.sockets.emit("rango",await dao.filtroPrecio(data))
    })

})

 productoRouter.get("/listar",async (req,res) => {
    if(isAdmin){
        const listar = await dao.readProduct()
        // const result = memoria.readProduct()
            // res.status(200).send(JSON.stringify(result))
        res.status(200).send(listar)
        return
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

productoRouter.post("/guardar", async(req,res) =>{
    if(!isAdmin){
        const error = {error:1,descripcion:`/carrito/agregar post no autorizada`}
        res.status(200).send(error)
        return
    }
    const  producto  = req.body 
    console.log(producto.precio , producto.title , producto.thumbnail,producto.codigo,producto.stock);
    // if(producto.precio && producto.title && producto.thumbnail){
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

app.get("/",(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
})

productoRouter.get("/vista", (req,res) => {
    const arrayProducts = memoria.readProduct()
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


 