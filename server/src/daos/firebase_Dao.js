const firebaseAdmin = require("firebase-admin");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert("./src/daos/base-backend-product-firebase-adminsdk-4ullb-5ab3801690.json"),
  databaseURL: "https://base-backend-product.firebaseio.com",
});
console.log("Base de datos conectada Firebase")
const firestoreAdmin = firebaseAdmin.firestore();
const collection = firestoreAdmin.collection("productos");

class FireBaseDao {

  constructor() {
    this.productos = [];
    this.filtroName=[]
    this.codigo = []
    this.stock=[]
    this.precio=[]
    this.mensaje=[]
    this.productoById=[]
    this.collectionMensajes= "mensajes"
   
  } 

  async filtroNombre(nombre){
    if(nombre) { 
      try{
        const queryGet = await collection.where("title", "==", nombre).get();
        this.filtroName = queryGet.docs.map((doc)=>{
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title,
            precio: data.precio,
            thumbnail: data.thumbnail,
            codigo: data.codigo,
            stock: data.stock,
            timestamp: data.timestamp,
            descripcion: data.descripcion,
          };
        });
      }catch(error){
        console.log(error)
      }
    }

    return  this.filtroName
  } 

  async filtroPrecio(objet){
    if(objet){
      try{
        const queryGet = await collection.where("precio", objet.operador, +objet.precio).get();
        this.precio = queryGet.docs.map((doc) => (
        {
          id: doc.id,
          title: doc.data().title,
          precio: doc.data().precio,
          thumbnail: doc.data().thumbnail,
          codigo: doc.data().codigo,
          stock: doc.data().stock,
          timestamp: doc.data().timestamp,
          descripcion: doc.data().descripcion,
        }
        ))
      }catch(error){
        console.log(error)
      }
    }

    return this.precio
  }

  async filtroCodigo(codigo){
    if(codigo){
      try {
        const queryGet = await collection.where("codigo", "==", codigo).get();
        this.codigo = queryGet.docs.map( (doc) => (
        {
          id: doc.id,
          title: doc.data().title,
          precio: doc.data().precio,
          thumbnail: doc.data().thumbnail,
          codigo: doc.data().codigo,
          stock: doc.data().stock,
          timestamp: doc.data().timestamp,
          descripcion: doc.data().descripcion,
        }))
      }catch(error){
        console.log(error)
      }
    }

    return  this.codigo
  }

  async filterStock(object){
    if(object){ 
      try{
        const queryGet = await collection.where("stock", object.operador, +object.stock).get()
        this.stock = queryGet.docs.map((doc) =>(
          {
            id: doc.id,
            title: doc.data().title,
            precio: doc.data().precio,
            thumbnail: doc.data().thumbnail,
            codigo: doc.data().codigo,
            stock: doc.data().stock,
            timestamp: doc.data().timestamp,
            descripcion: doc.data().descripcion,
          }
        ))
      }catch(error){
        console.log(error)
      }
    }

    return this.stock
  }

  async readProduct(){
    try{
      const queryGet = await collection.get();
      this.productos = queryGet.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        precio: data.precio,
        thumbnail: data.thumbnail,
        codigo: data.codigo,
        stock: data.stock,
        timestamp: data.timestamp,
        descripcion: data.descripcion,
      }
      })
    }catch (error) {
      console.log(error);
    }

    return  this.productos
  }

  async getProductById(id){
    try{
      let result = await this.readProduct()
      this.productoById = result.find(element => element.id == id)
    }catch (error) {
      console.log(error);
    }

    return this.productoById
  }

  async creatProduct(producto){
    console.log("CREATE");
    try{
      await collection.doc().create(producto)
      console.log("Datos insertados");
    }catch (error) {
      console.log(error);
    }

    return producto
  }

  async update(producto,id){
    console.log("UPDATE");
    try{
      let doc = await collection.doc(id)
      .update(
      {
        title: producto.title,
        precio: producto.precio, 
        thumbnail: producto.thumbnail, 
        codigo: producto.codigo, 
        stock: producto.stock,
        descripcion: producto.descripcion,
      })
      console.log(doc)
    }catch (error) {
      console.log(error);
    }

    return producto
  }

  async delete(id){
    console.log("DELETE");
    let doc = await collection.doc(`${id}`).delete();
    console.log(doc);

    return doc 
  }

  async creatMessage(datos){
    const firestoreAdmin = firebaseAdmin.firestore();
    const collection = firestoreAdmin.collection(this.collectionMensajes);
    try{
      await collection.doc().create(datos)
    }catch (error) {
      console.log(error);
    }
  }

  async leerMensages(){
    try{
      const queryGet = await firestoreAdmin.collection(this.collectionMensajes).get();
      this.mensaje = queryGet.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        fecha: data.fecha,
        texto: data.texto,
      }
      })
    }catch (error) {
      console.log(error);
    }

    return this.mensaje
  }
}
module.exports = FireBaseDao