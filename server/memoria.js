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

  class Memoria {
    constructor() {
        this.productos = [];
        this.count = 0
      
    }
    getProduct(){
        return this.productos
    }
    getProductById(id){
        const result = this.productos.find(elemento => elemento.id === +id) 
        return result
    }
    addProduct(producto){
        this.productos.push({...producto,id:this.count+1,timestamp:Fecha()});
        this.count++
    (async () => {
        try{
          const tableName = "productos";
          if(await knex.schema.hasTable(tableName)){
            await knex.schema.dropTable(tableName);
          }
          await knex.schema.createTable(tableName, (table) => {
            table.integer("id");
            table.string("title");
            table.float("precio");
            table.string("thumbnail");
            table.integer("stock");
            table.string("codigo");
            table.string("timestamp");
            table.string("submit");
            });
          console.log("tabla creada");
  
          await knex(tableName).insert(this.productos);
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
    })();
        
      return producto
    }
    updateProduct(ProductoActualizado,id){
        const indexProducto = this.productos.findIndex(elemento => elemento.id === +id)
        return this.productos[indexProducto] = {...ProductoActualizado, id: +id}
    }
    deleteProduct(id,productDelete){
        const result = this.productos.filter(elemento => elemento.id !== parseInt(id) )
        this.productos = result
        return productDelete
    }
}
const knex = require("knex")({
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "product",
    },
  });
module.exports = {Memoria,Fecha}


