const mongoose = require("mongoose");

const mensajeSchema = new mongoose.Schema({
    email: {
        type:String,
        require: true,
        max:100,
    },
    fecha:{
        type: String,
        require: true,
    },
    texto:{
        type: String,
        require: true,
    },
});

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    precio:{
        type: Number,
        require: true,
    },
    thumbnail:{
        type: String,
        require: true,
    },
    codigo:{
        type: String,
        require: true,
    },
    stock:{
        type: Number,
        require: true,
    },
    timestamp:{
        type: String,
        require: true,
    },
    descripcion:{
        type: String,
        require: true,
    }
});

module.exports = {
    mensajes : mongoose.model("mensajes",mensajeSchema),
    productos : mongoose.model("productos",productSchema)
}