"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var memoria_js_1 = require("./memoria.js");
var express_handlebars_1 = __importDefault(require("express-handlebars"));
var socketIo = __importStar(require("socket.io"));
var fs_1 = __importDefault(require("fs"));
var http_1 = __importDefault(require("http"));
var __dirname = path_1.default.resolve();
var app = (0, express_1.default)();
var port = 8080;
var memoria = new memoria_js_1.Memoria();
var productoRouter = express_1.default.Router();
var server = http_1.default.createServer(app);
var io = new socketIo.Server(server);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(__dirname + "/public"));
app.use('/api', productoRouter);
app.set("views", "./views");
app.set("view engine", "hbs");
app.engine("hbs", (0, express_handlebars_1.default)({
    extname: "hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + '/views/partials/',
    defaultLayout: "index.hbs",
}));
var messages = [];
server.on("error", function (error) {
    if (error) {
        throw Error("Error inicando el servidor: " + error);
    }
});
server.listen(port, function () {
    console.log("El servidor es escuchando en el port " + port);
});
productoRouter.get("/productos/listar", function (req, res) {
    var result = memoria.getProduct();
    if (result.length > 0) {
        // res.status(200).send(JSON.stringify(result))
        res.status(200).send(result);
        return;
    }
    res.status(404).send({ error: "no hay productos cargados" });
});
productoRouter.get("/productos/listar/:id", function (req, res) {
    var id = req.params.id;
    // const parametroid = req.params.id
    var result = memoria.getProductById(id);
    if (result) {
        res.status(200).send(JSON.stringify(result));
        return;
    }
    res.status(404).send({ error: "producto no encontrado" });
});
productoRouter.post("/productos/guardar", function (req, res) {
    var producto = req.body;
    console.log(producto.precio, producto.title, producto.thumbnail);
    if (producto.precio && producto.title && producto.thumbnail) {
        memoria.addProduct(producto);
        var arrayProducts = memoria.getProduct();
        io.sockets.emit('cargarProductos', arrayProducts);
        res.redirect('/');
        return;
    }
    res.status(404).send({ error: "informacion incompleta" });
});
productoRouter.put("/productos/actualizar/:id", function (req, res) {
    var id = req.params.id;
    var ProductoActualizado = req.body;
    var productoExistente = memoria.getProductById(id);
    if (ProductoActualizado.title && ProductoActualizado.precio && ProductoActualizado.thumbnail && productoExistente) {
        res.status(200).send(memoria.updateProduct((ProductoActualizado), id));
        return;
    }
    res.status(404).send({ error: "producto no encontrado, no se puede actualizar" });
});
productoRouter.delete("/productos/borrar/:id", function (req, res) {
    var id = req.params.id;
    var productDelete = memoria.getProductById(id);
    if (productDelete) {
        res.status(200).send(memoria.deleteProduct(id, productDelete));
        return;
    }
    res.status(404).send({ error: "producto no encontrado, no se puede borrar" });
});
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
productoRouter.get("/productos/vista", function (req, res) {
    var arrayProducts = memoria.getProduct();
    var bolean = arrayProducts.length > 0 ? true : false;
    res.render("main.hbs", {
        listExists: bolean,
        arrayProducts: arrayProducts,
    });
});
io.on("connection", function (socket) {
    var arrayProducts = memoria.getProduct();
    console.log('se conecto en el backen');
    socket.emit('cargarProductos', arrayProducts);
    socket.emit("messages", messages);
    socket.on("new-message", function (data) {
        messages.push(data);
        io.sockets.emit("messages", messages);
        fs_1.default.writeFile("./registro.txt", JSON.stringify(messages, null, "\t"), function (error) {
            if (error) {
                console.log("Hubo un error:\n    " + error.message);
            }
            else {
                console.log("Archivo grabado!");
            }
        });
    });
});
