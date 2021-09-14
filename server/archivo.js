const fs = require("fs");

class Archivo {
    leerArchivo(nombreArchivo){
        fs.readFile(`${nombreArchivo}`, "utf-8", (error, data) => {
            if (error) {
              console.log(`Hubo un error:\n    ${error.message}`);
            } else {
              console.log(`Leyendo archivo: ${data}`);
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

module.exports = Archivo