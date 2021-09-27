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

class Archivo {

  async addTablemysql(arrayProduct){
    try{
      if(await knex.schema.hasTable(tableName)){
      await knex.schema.dropTable(tableName);
      }
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

      await knex(tableName).insert(arrayProduct);
      console.log("productos insertados");

      let productos = await knex.from(tableName).select("*");
      for (const producto of productos) {
      console.log(
        `${producto["id"]} ${producto["title"]} ${producto["precio"]} ${producto["thumbnail"]} ${producto["codigo"]} ${producto["timestamp"]} `
        );
      }
    }catch (error) {
        console.log(error);
    } 
    // finally {
    //   knex.destroy();
    // }
  }
  async deletefileMysql(id){
    try {
    await knex.from(tableName).where("id", "=", `${id}`).del();
    console.log("producto eliminado");
    }  catch (error) {
      console.log(error);
    }
  }

  async baseDatosSqlite3(message){
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
        console.log("mensajes insertados");

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

module.exports = Archivo