const socket = io();

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

const hbsTemplate = Handlebars.compile(`
<h1 class="silver animate__animated animate__zoomIn container mt-3">Vista de Productos</h1>
{{#if data}}
<div  mt-3">
<table border="1" class="table table-dark table-hover">
    <thead>
        <tr class="thead-light">
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Foto</th>
        </tr>
    </thead>
    <tbody>
        {{#each data}}
        <tr>
            <td>{{title}}</td>
            <td>{{precio}}</td>
            <td><img src="{{thumbnail}}"height="30" width="30" ></td>
        </tr>
        {{/each}}
    </tbody>
</table>
{{else}}
<div>
    <h2 class="sub-titulo"> No hay productos</h2>
</div>
{{/if}}
</div>
`);

socket.on("cargarProductos" , data => {
    console.log(data);
    const html = hbsTemplate({data:data});
    document.getElementById('tablaProductos').innerHTML = html
})

const clearInput = () =>{
    document.getElementById("texto").value= "";
}

socket.on("messages", (data) =>{
    console.log(data)
    // document.getElementById("messages").innerHTML = data.map(
    // ({email,texto,fecha}) => 
    // `
    // <div class="mb-3">
    // <strong class="email-color">${email}</strong>
    // <span class="fecha-color">[${fecha}]:</span>
    // <em class="text-color">${texto}</em>
    // </div>
    // `
    // ).join(" ");
    // clearInput();
})

const addMessage = () =>{
    if(document.getElementById("email").value.length > 0){
    const message = {
        author: {
            email: document.getElementById("email").value,
            fecha: Fecha(),
            nombre: document.getElementById("messageNombre").value,
            apellido: document.getElementById("messageApellido").value,
            edad: document.getElementById("messageEdad").value,
            alias: document.getElementById("messaAlias").value,
        },
        texto: document.getElementById("texto").value,
    }
    socket.emit("new-message", message);
    }
    return false
}

//Filtros
const creatTable = (divHtml,data)=>{
    document.getElementById(divHtml).innerHTML = data.map(
    ({title,precio,codigo,stock,}) => 
    `
    <table border="1" class="table table-dark table-hover">
        <thead>
            <tr class="thead-light">
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col">codigo</th>
                <th scope="col">stock</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${title}</td>
                <td>${precio}</td>
                <td>${codigo}</td>
                <td>${stock}</td>
            </tr>
        </tbody>
    </table>
    `
    ).join(" ");
}

//filtro por nombre
socket.on("lista", (data) =>{
    console.log(data)
    creatTable("filtroNombre",data)
})

const filtroNombre = () =>{
    socket.emit("Name",document.getElementById("nombre").value)
    return false
}

//filtro por precio
// socket.on("rango", (data) =>{
//     console.log(data)
//     creatTable("Precio",data)
// })
// const filtroPrecio = () =>{
//     socket.emit("precio",document.getElementById("Price").value)
//     return false
// }

//filtro por precio
socket.on("rango", (data) =>{
    console.log(data)
    creatTable("Precio",data)
})
const filtroPrecio = () =>{
    const precioOperador = {
        precio: document.getElementById("Price").value,
        operador: document.getElementById("operadorPrecio").value,
    }
    socket.emit("precio", precioOperador)
    return false
}


//FILTRO POR CODIGO
socket.on("code", (data) =>{
    console.log(data)
    creatTable("codigoTabla",data)
})
const filtroCode = () =>{
    socket.emit("inputCode",document.getElementById("Codigo").value)
    return false
}

//FILTRO STOCK
socket.on("listaStock", (data) =>{
    console.log(data)
    creatTable("stockTable",data)
})
const filtroStock = () =>{
    const stockOperador = {
        stock: document.getElementById("Stock").value,
        operador: document.getElementById("operadorStock").value,
    }
    socket.emit("Stock", stockOperador)
    return false
}
