const fs = require("fs");
class FsDao {
  constructor(){
    this.productos = [];
    this.count = 0
    this.filtroName=[]
    this.precio=[]
    this.codigo = []
    this.stock=[]
    this.filename= "./archivostxt/mensajes.txt" 
    this.productFilename= "./archivostxt/productos.txt" 
    this.mensaje = []
    this.mensajeRead = []
    // this.messageId=0
    this.productoGet=[]
  }

  async filtroNombre(nombre){
    if(nombre){ 
      try{
        let resultName = await this.readProduct()
        this.filtroName = resultName.filter((item) => item.title == nombre)
        console.log("filtro name",this.filtroName)
      }catch(error){
        console.log(error);
      }
    }
       
    return this.filtroName
  }

   filtroPrecio(object){
    if(object){
      try{
        let resulPrecio =  this.readProduct()
        console.log(object);
        if((object.operador) == "="){
          console.log(object.precio, object.operador)
          this.precio  = resulPrecio.filter(item => item.precio == object.precio)
        }if(object.operador == ">"){
          this.precio  = resulPrecio.filter(item => item.precio > object.precio)
        }if(object.operador == '<'){
          this.precio = resulPrecio.filter(item => item.precio < object.precio)
        }
      }catch(error){
        console.log(error);
      }
    }

    return this.precio
  }

  filtroCodigo(codigo){
    if(codigo){ 
      try{
        let resulPrecio =  this.readProduct()
        this.codigo =   resulPrecio.filter((item) => item.codigo == codigo)
        console.log("filtro codigo", this.codigo)
      }catch(error){
      }
    }
       
    return  this.codigo
  }

  filterStock(object){
    if(object){
      try{
        let resulPrecio =  this.readProduct()
        if((object.operador) == '='){
          console.log(object.stock, object.operador)
          this.stock = resulPrecio.filter(item => item.stock == object.stock)
        }if(object.operador == '>'){
          this.stock = resulPrecio.filter(item => item.stock > object.stock)
        }if(object.operador == '<'){
          this.stock = resulPrecio.filter(item => item.stock < object.stock)
        }
      }catch(error){
        console.log(error);
      }
    }

    return this.stock
  }

  readProduct() {
    try{
      fs.readFile(this.productFilename, "utf-8", (error, data) => {
        if (error) {
        console.log(`Hubo un error:\n    ${error.message}`);
        } else {
          if(data){
            this.productoGet = JSON.parse(data); 
          }
          
        }
      });
    }catch (error){
      console.log(error);
    }
 
    return  this.productoGet 
  }
  
  getProductById(id) {
    let getId = this.readProduct()
    const result=  getId.find(elemento => elemento.id === +id) 

    return result
  }

  creatProduct(product) {
    if( this.productos.length == 0 &&   this.productoGet.length == 0){
      this.productos.push({...product,id:this.count+1})
      this.count++
    this.escribirArchivo(this.productFilename ,this.productos)
    }else{
        let result = this.readProduct()
        this.productos = result
        this.productos.push({...product,id:this.count+1})
        this.count++
        this.escribirArchivo(this.productFilename ,this.productos)
    }

    return  this.productos
  }

  update(ProductoActualizado,id){
    const result = this.readProduct()
    const index =result.findIndex(element => element.id === +id)
    this.productoGet[index] = {...ProductoActualizado, id: +id}
    this.escribirArchivo(this.productFilename , this.productoGet)
  }

  delete(id) {
    const result=this.readProduct()
    this.productoGet= result.filter( elemento => elemento.id !== +id)
    this.escribirArchivo(this.productFilename , this.productoGet)
  
    return  this.productoGet
  }

  creatMessage(datos){
    this.mensaje.push(datos)
    this.escribirArchivo(this.filename,this.mensaje)
  }

  leerMensages(){
    try{
      fs.readFile(this.filename, "utf-8", (error, data) => {
        if (error) {
        console.log(`Hubo un error:\n    ${error.message}`);
        } else {
          this.mensajeRead = JSON.parse(data);  
        }
      });
    }catch (error){
      console.log(error);
    }

    return  this.mensajeRead
  }

  leerArchivo(nombreArchivo){
    fs.readFile(`${nombreArchivo}`, "utf-8", (error, data) => {
      if (error) {
      console.log(`Hubo un error:\n    ${error.message}`);
      } else {
        console.log(`Leyendo archivo: ${data}`);
        return data
      }
    });
  }

  escribirArchivo(nombreArchivo,array){
    fs.writeFile(`${nombreArchivo}`,JSON.stringify(array,null,"\t"), (error) => {
      if (error) {
        console.log(`Hubo un error:\n    ${error.message}`);
      } else {
        console.log("Archivo grabado!");
       }
    });
  }
}

module.exports = FsDao