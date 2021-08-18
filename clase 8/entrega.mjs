import express from "express"

const app = express()
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port,() => {
    console.log(`El servidor es escuchando en el puest ${port}`);
})

class Memoria {
    constructor() {
        this.array = [];
        this.count = 0
    }

    getArray(){
        return this.array
    }

    getElementById(id){
        const result = this.array.filter(elemento => elemento.id == id) 
        return result
    }

    addElement(objeto){
        this.array.push({...objeto,id:this.count+1});
        this.count++
        return objeto

    }
}

const memoria = new Memoria()

app.get("/api/productos/listar", (req,res) => {
    const result = memoria.getArray()
    if(result.length > 0){
        res.status(200).send(JSON.stringify(result))
    }else{
        res.status(404).send({error:"no hay productos cargados"})
    }
})

app.get("/api/productos/listar/:id", (req,res) => {
    const { id } = req.params
    const result = memoria.getElementById(id)
    if(result.length > 0){
        res.status(200).send(JSON.stringify(result[0]))
    }else{
        res.status(404).send({error:"producto no encontrado"})
    }
})

app.post("/api/productos/guardar", (req,res) =>{
    const  producto  = req.body 
    console.log(producto.precio , producto.title , producto.thumbnail);
    if(producto.precio && producto.title && producto.thumbnail){
        memoria.addElement(producto)
        res.status(200).send(producto)
    }else{
        res.status(400).send({error:"informacion incompleta"})
    }
})