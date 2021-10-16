const util = require("util");
const normalizr = require("normalizr")
const fs = require("fs");
const { normalize } = require("path");
const FsDao = require("./fsDao");
const Fecha = () => {
    const hoy = new Date()
    let dia= hoy.getDate();
    let mes = hoy.getMonth() + 1;
    let año = hoy.getFullYear();
    dia = ('0' + dia).slice(-2);
    mes = ('0' + mes).slice(-2);
    let hora = hoy.getHours();
    let minutos = hoy.getMinutes();
    let segundos = hoy.getSeconds();
    const fecha = `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`
    return fecha
}
const fsDao = new FsDao()
class Memoria {
  constructor() {
    this.productos = [];
    this.count = 0
    this.filtroName=[]
    this.precio=[]
    this.codigo = []
    this.stock=[]
    this.filename= "./archivostxt/mensajes.txt" 
    this.mensaje = []
    this.messageId=0
  }

  filtroNombre(nombre){
    if(nombre){ 
      this.filtroName = this.productos.filter((item) => item.title == nombre)
      console.log("filtro name",this.filtroName)
    }
       
    return this.filtroName
  }

  filtroPrecio(object){
    if(object){
      console.log(object);
      if((object.operador) == "="){
        console.log(object.precio, object.operador)
        this.precio  = this.productos.filter(item => item.precio == object.precio)
      }if(object.operador == ">"){
        this.precio  = this.productos.filter(item => item.precio > object.precio)
      }if(object.operador == '<'){
        this.precio =this.productos.filter(item => item.precio < object.precio)
      }
    }
    return this.precio
  }

  filtroCodigo(codigo){
    if(codigo){ 
      this.codigo =   this.productos.filter((item) => item.codigo == codigo)
      console.log("filtro codigo", this.codigo)
    }
       
    return  this.codigo
  }

  filterStock(object){
    if(object){
      if((object.operador) == '='){
        console.log(object.stock, object.operador)
        this.stock = this.productos.filter(item => item.stock == object.stock)
      }if(object.operador == '>'){
        this.stock = this.productos.filter(item => item.stock > object.stock)
      }if(object.operador == '<'){
        this.stock = this.productos.filter(item => item.stock < object.stock)
      }
    }

    return this.stock
  }

  readProduct(){
    return this.productos
  }

  getProductById(id){
    const result = this.productos.find(elemento => elemento.id === +id) 

    return result
  }

  creatProduct(producto){
    this.productos.push({...producto,id:this.count+1});
    this.count++
    fsDao.escribirArchivo("./archivostxt/productos.txt",this.productos)
    return this.productos
  }

  update(ProductoActualizado,id){
    const indexProducto = this.productos.findIndex(elemento => elemento.id === +id)
    this.productos[indexProducto] = {...ProductoActualizado, id: +id}
  }

  delete(id){
    this.productos = this.productos.filter(elemento => elemento.id !== +(id) )

    return this.productos
    }

  creatMessage(datos){
    this.mensaje.push(datos)
    fsDao.escribirArchivo(this.filename,this.mensaje)
  }

  leerMensages(){
    return this.mensaje
  }

  // creatMessage(datos){
  //   const createMessaWithId = {
  //     id: this.messageId++,
  //     ...datos
  //   };
  //   this.mensaje.push(createMessaWithId)
  //   fsDao.escribirArchivo(this.filename,this.mensaje)
  // }

  // leerMensages(){
  // const authorSchema = new  normalizr.schema.Entity(
  //   'author',
  //   undefined,
  //   {idAttribute: 'email'}
  //   );

  // const mesaggeSchema = new normalizr.schema.Entity('message',
  // {
  //   author: authorSchema,
  // });

  // const messagesSchema = new normalizr.schema.Entity('messages',
  // {
  //   messages: [mesaggeSchema],
  // });

  // const originalData = {
  //   id: '1',
  //   messages: this.mensaje
  // }

  // const normalizedData = normalizr.normalize(originalData,messagesSchema);

  //   return normalizedData
  // }

}
module.exports = {Memoria,Fecha}
