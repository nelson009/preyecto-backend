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
        this.count = 0
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
                }
            })
        }catch (error) {
            console.log(error);
        }
        return  this.productos
    }
    async creatProduct(producto){
        console.log("CREATE");
        try{await collection.doc(`${this.count+1}`).create(producto)
        console.log("Datos insertados");
        this.count++
        }catch (error) {
            console.log(error);
        }
        return producto
    }
    async update(producto,id){
        console.log("UPDATE");
        try{let doc = await collection.doc(id)
        .update(
            {title: producto.title,
             precio: producto.precio, 
             thumbnail: producto.thumbnail, 
             codigo: producto.codigo, 
             stock: producto.stock})
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
        const collection = firestoreAdmin.collection("mensajes");
        try{await collection.doc().create(datos)
        }catch (error) {
            console.log(error);
        }
    }
}
module.exports = FireBaseDao