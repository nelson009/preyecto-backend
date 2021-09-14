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
    document.getElementById("messages").innerHTML = data.map(
    ({email,texto,fecha}) => 
    `
    <div class="mb-3">
    <strong class="email-color">${email}</strong>
    <span class="fecha-color">[${fecha}]:</span>
    <em class="text-color">${texto}</em>
    </div>
    `
    ).join(" ");
    clearInput();
})

const addMessage = () =>{
    if(document.getElementById("email").value.length > 0){
    const message = {
        email: document.getElementById("email").value,
        fecha: Fecha(),
        texto: document.getElementById("texto").value,
        };
   
    socket.emit("new-message", message);
    }
    return false
}
