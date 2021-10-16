const {optionsSqlite3} = require("../options/mariaDB")

 class Sqlite3Dao {
  constructor(){
    this.productos=[]
    this.filtroName=[]
    this.precio=[]
    this.codigo = []
    this.stock=[]
    this.tableName = "productos";
    this.messageTable= "messages";
    this.mensaje=[]

  }

  async filtroNombre(nombre){
    if(nombre){ 
      const knex = require("knex")(optionsSqlite3);
      this.filtroName = await knex.from(this.tableName).where("title", "=", nombre).select("*");
    }

    return  this.filtroName
  }

  async filtroPrecio(object){
    if(object){
      const knex = require("knex")(optionsSqlite3);
      this.precio = await knex.from(this.tableName).where("precio", object.operador, object.precio).select("*");
    }

    return this.precio
  }

  async filtroCodigo(codigo){
    if(codigo){
      const knex = require("knex")(optionsSqlite3);
      this.codigo= await knex.from(this.tableName).where("codigo", "=", codigo).select("*"); 
    }

    return   this.codigo
  }

  async filterStock(object){
    if(object){
    const knex = require("knex")(optionsSqlite3);
    this.stock = await knex.from( this.tableName).where("stock", object.operador, object.stock).select("*");
    }

    return this.stock
  }

  async readProduct(){
    const knex = require("knex")(optionsSqlite3);
    try{
      await this.iniciarTabla()
      this.productos = await knex(this.tableName).select("*");
    }catch (error) {
      console.log(error);
    }
    finally {
      knex.destroy();
    }

    return this.productos
  }

  async getProductById(id){
    const knex = require("knex")(optionsSqlite3);
    const result= await knex.from(this.tableName).where("id", "=", id).select("*"); 
    
    return result
  }

  async iniciarTabla (){
    const knex = require("knex")(optionsSqlite3);
    try{
      if(!await knex.schema.hasTable(this.tableName)){
        await knex.schema.createTable(this.tableName, (table) => {
          table.increments("id");
          table.string("title");
          table.float("precio");
          table.string("thumbnail");
          table.integer("stock");
          table.string("codigo");
          table.string("timestamp");
          table.string("submit");
          table.string("descripcion")
          });
        console.log("tabla creada");
      }
    }catch (error){
      console.log(error);
    } 
    finally {
       knex.destroy();
    }
  }

  async creatProduct(Product){
    const knex = require("knex")(optionsSqlite3);
    try{
      await this.iniciarTabla()
      await knex(this.tableName).insert(Product);
      console.log("productos insertados");
    
    }catch (error) {
        console.log(error);
    } 
    finally {
      knex.destroy();
    }
  }

  async delete(id){
    const knex = require("knex")(optionsSqlite3);
    try {
      await knex.from(this.tableName).where("id", "=", `${id}`).del();
    console.log("producto eliminado");
    }  catch (error) {
      console.log(error);
    } 
    finally {
       knex.destroy();
    }
  }

  async update (producto,id) {
    const knex = require("knex")(optionsSqlite3);
    try {
      await knex.from(this.tableName).where("id", "=", `${id}`)
      .update("title",`${ producto.title}`)
      .update( "precio",`${ producto.precio}`,)
      .update( "thumbnail",`${ producto.thumbnail}`,)
      .update( "codigo",`${ producto.codigo}`,)
      .update( "stock",`${ producto.stock}`,)
      console.log("producto actualizado");
    }catch (error) {
      console.log(error);
    }finally {
      knex.destroy();
    }
  }

  async creatMessage(message){
    const knex = require("knex")(optionsSqlite3);
    try{
      await this.creatTableMessage()
      await knex(this.messageTable).insert(message);
      console.log("mensajes insertados ");
    }catch (error) {
      console.log(error);
    } finally {
      knex.destroy();
    }
  }

  async creatTableMessage(){
    const knex = require("knex")(optionsSqlite3);
    if(!await knex.schema.hasTable(this.messageTable)){
      await knex.schema.createTable(this.messageTable, (table) => {
        table.increments("id");
        table.string("email");
        table.string("fecha");
        table.string("texto");
        });
      console.log("tabla creada");
    }
  }

  async leerMensages(){
    const knex = require("knex")(optionsSqlite3);
    try{
      await this.creatTableMessage()
      this.mensaje = await knex(this.messageTable).select("*");
    }catch (error) {
      console.log(error);
    }
    finally {
      knex.destroy();
    }

    return this.mensaje
  }
}

module.exports = Sqlite3Dao