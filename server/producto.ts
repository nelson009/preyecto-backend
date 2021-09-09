export class Producto {
    public title: string ;
    public precio:string;
    public thumbnail:string;
    public id:any;
    constructor(title:string,precio:string,thumbnail:string,id:any){
        this.title= title;
        this.precio= precio;
        this.thumbnail= thumbnail;
        this.id= id;
    }
 }
 