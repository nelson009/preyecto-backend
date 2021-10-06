
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "product",
  },
});
const tableName = "productos";
 class MysqlDao {
  constructor(){
    this.productos=[]
 
}
  async readProduct(){
    
    try{
      await this.iniciarTabla()
      const result = await knex(tableName).select("*");
      this.productos = result
    //   // for (const producto of productos) {
    //   // console.log(
    //   //   `${producto["id"]} ${producto["title"]} ${producto["precio"]} ${producto["thumbnail"]} ${producto["codigo"]} ${producto["timestamp"]} `
    //   //   );
    //   // }
    }catch (error) {
      console.log(error);
    } 
           
    // // return this.productos
    // await this.iniciarTabla()
    // this.productos = await knex.from(tableName).select("*")
    // // console.log("result",result)
    return this.productos
  }
  async iniciarTabla (){
    try{
      if(!await knex.schema.hasTable(tableName)){
        await knex.schema.createTable(tableName, (table) => {
          table.increments("id");
          table.string("title");
          table.float("precio");
          table.string("thumbnail");
          table.integer("stock");
          table.string("codigo");
          table.string("timestamp");
          table.string("submit");
          });
        console.log("tabla creada");
      }
    }catch (error){
      console.log(error);
    } 
    // finally {
    //    knex.destroy();
    // }
  }

  async creatProduct(Product){
    try{
      await this.iniciarTabla()
      await knex(tableName).insert(Product);
      console.log("productos insertados");
    
    }catch (error) {
        console.log(error);
    } 
    // finally {
    //   knex.destroy();
    // }
  }
  async delete(id){
    try {
      await knex.from(tableName).where("id", "=", `${id}`).del();
    console.log("producto eliminado");
    }  catch (error) {
      console.log(error);
    } 
    // finally {
    //    knex.destroy();
    // }
  }
  async update (producto,id) {
    try {
      
      await knex.from(tableName).where("id", "=", `${id}`)
      .update("title",`${ producto.title}`)
      .update( "precio",`${ producto.precio}`,)
      .update( "thumbnail",`${ producto.thumbnail}`,)
      .update( "codigo",`${ producto.codigo}`,)
      .update( "stock",`${ producto.stock}`,)
      console.log("producto actualizado");
    }catch (error) {
      console.log(error);
    } 
  }
  async creatMessage(message){
      const knex = require("knex")({
      client: "sqlite3",
      connection: {
      filename: "./DB/mensajes.sqlite",
      },
      useNullAsDefault: true,
      });
      try{
        const tableName = "messages";
        if(await knex.schema.hasTable(tableName)){
          await knex.schema.dropTable(tableName);
        }
        await knex.schema.createTable(tableName, (table) => {
          table.increments("id");
          table.string("email");
          table.string("fecha");
          table.string("texto");
          });
        console.log("tabla creada");

        await knex(tableName).insert(message);
        console.log("mensajes insertados sqlite3");

        let mensajes = await knex.from(tableName).select("*");
        for (const mensaje of mensajes) {
        console.log(
        `${mensaje["id"]} ${mensaje["email"]} ${mensaje["fecha"]} ${mensaje["texto"]}`
        );
        }
      }catch (error) {
        console.log(error);
      } 
  }
}

module.exports = MysqlDao