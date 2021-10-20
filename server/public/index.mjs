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
//CENTRO DE MENSAJES ANTES DE NORMALIZAR
// socket.on("messages", (data) =>{
//     console.log(data)
//     document.getElementById("messages").innerHTML = data.map(
//     ({email,texto,fecha}) => 
//     `
//     <div class="mb-3">
//     <strong class="email-color">${email}</strong>
//     <span class="fecha-color">[${fecha}]:</span>
//     <em class="text-color">${texto}</em>
//     </div>
//     `
//     ).join(" ");
//     clearInput();
// })

// const addMessage = () =>{
//     if(document.getElementById("email").value.length > 0){
//     const message = {
//         email: document.getElementById("email").value,
//         fecha: Fecha(),
//         texto: document.getElementById("texto").value,
//         };
   
//     socket.emit("new-message", message);
//     }
//     return false
// }

socket.on("messages", (data) =>{
    const authorSchema = new  normalizr.schema.Entity(
        'author',
        undefined,
        {idAttribute: 'email'});
    
    const mesaggeSchema = new normalizr.schema.Entity('message',
    {
        author: authorSchema,
    });
    
    const messagesSchema = new normalizr.schema.Entity('messages',
    {
        messages: [mesaggeSchema],
    });
  
    console.log('-------------- NORMALIZADO --------------')

    console.log(data)
    const normalizedLength = JSON.stringify(data).length
    console.log(normalizedLength);

    console.log('-------------- DESNORMALIZADO --------------');

    const denormalizedData = normalizr.denormalize(
    data.result,
    messagesSchema,
    data.entities,
    );
    console.log(denormalizedData);
    const denormalizedLength = JSON.stringify(denormalizedData).length;
    console.log(denormalizedLength);

    console.log('-------------- COMPRESION --------------');

    const compresion = `${Math.round((normalizedLength / denormalizedLength) * 100).toFixed(2)}%`
    console.log(compresion);

    document.getElementById("messages").innerHTML = denormalizedData.messages.map(
    ({texto,author,fecha}) => 
    `
    <div class="mb-3">
    <strong class="email-color">${author.email}</strong>
    <span class="fecha-color">[${fecha}]:</span>
    <em class="text-color">${texto}</em>
    <img src='${author.avatar}'height="30" width="30" class="avatarMensajes">
    </div>
    `
    ).join(" ");
    clearInput();
    
    document.getElementById("compresion").innerHTML = `Centro de Mensajes (${compresion})`
       
})

const addMessage = () =>{
    if(document.getElementById("email").value.length > 0){
    const message = {
        author: {
            email: document.getElementById("email").value,
            nombre: document.getElementById("messageNombre").value,
            apellido: document.getElementById("messageApellido").value,
            edad: document.getElementById("messageEdad").value,
            alias: document.getElementById("messaAlias").value,
            avatar: document.getElementById("messageAvatar").value,
        },
        texto: document.getElementById("texto").value,
        fecha: Fecha(),
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
