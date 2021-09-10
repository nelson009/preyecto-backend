"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _classmemoria = require("./classmemoria.js");

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var socketIo = _interopRequireWildcard(require("socket.io"));

var _fs = _interopRequireDefault(require("fs"));

var _http = _interopRequireDefault(require("http"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _dirname = _path["default"].resolve();

var app = (0, _express["default"])();
var port = 8080;
var memoria = new _classmemoria.Memoria();
var messages = [];

var productoRouter = _express["default"].Router();

var server = _http["default"].createServer(app);

var io = new socketIo.Server(server);
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"]["static"]("".concat(_dirname, "/public")));
app.use('/api', productoRouter);
app.set("views", "./views");
app.set("view engine", "hbs");
app.engine("hbs", (0, _expressHandlebars["default"])({
  extname: "hbs",
  layoutsDir: "".concat(_dirname, "/views/layouts"),
  partialsDir: _dirname + '/views/partials/',
  defaultLayout: "index.hbs"
}));
server.on("error", function (error) {
  if (error) {
    throw Error("Error inicando el servidor: ".concat(error));
  }
});
server.listen(port, function () {
  console.log("El servidor es escuchando en el port ".concat(port));
});
productoRouter.get("/productos/listar", function (req, res) {
  var result = memoria.getProduct();

  if (result.length > 0) {
    // res.status(200).send(JSON.stringify(result))
    res.status(200).send(result);
    return;
  }

  res.status(404).send({
    error: "no hay productos cargados"
  });
});
productoRouter.get("/productos/listar/:id", function (req, res) {
  var id = req.params.id;
  var result = memoria.getProductById(id);

  if (result) {
    res.status(200).send(JSON.stringify(result));
    return;
  }

  res.status(404).send({
    error: "producto no encontrado"
  });
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

  res.status(404).send({
    error: "informacion incompleta"
  });
});
productoRouter.put("/productos/actualizar/:id", function (req, res) {
  var id = req.params.id;
  var ProductoActualizado = req.body;
  var productoExistente = memoria.getProductById(id);

  if (ProductoActualizado.title && ProductoActualizado.precio && ProductoActualizado.thumbnail && productoExistente) {
    res.status(200).send(memoria.updateProduct(ProductoActualizado, id));
    return;
  }

  res.status(404).send({
    error: "producto no encontrado, no se puede actualizar"
  });
});
productoRouter["delete"]("/productos/borrar/:id", function (req, res) {
  var id = req.params.id;
  var productDelete = memoria.getProductById(id);

  if (productDelete) {
    res.status(200).send(memoria.deleteProduct(id, productDelete));
    return;
  }

  res.status(404).send({
    error: "producto no encontrado, no se puede borrar"
  });
});
app.get("/", function (req, res) {
  res.sendFile(_dirname + '/public/index.html');
});
productoRouter.get("/productos/vista", function (req, res) {
  var arrayProducts = memoria.getProduct();
  var bolean = arrayProducts.length > 0 ? true : false;
  res.render("main.hbs", {
    listExists: bolean,
    arrayProducts: arrayProducts
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

    _fs["default"].writeFile("./registro.txt", JSON.stringify(messages, null, "\t"), function (error) {
      if (error) {
        console.log("Hubo un error:\n    ".concat(error.message));
      } else {
        console.log("Archivo grabado!");
      }
    });
  });
});
