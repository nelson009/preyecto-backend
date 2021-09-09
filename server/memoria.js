"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memoria = void 0;
var Memoria = /** @class */ (function () {
    function Memoria() {
        this.productos = new Array();
        this.count = 0;
    }
    Memoria.prototype.getProduct = function () {
        return this.productos;
    };
    Memoria.prototype.getProductById = function (id) {
        var result = this.productos.find(function (elemento) { return elemento.id === +id; });
        return result;
    };
    Memoria.prototype.addProduct = function (producto) {
        this.productos.push(__assign(__assign({}, producto), { id: this.count + 1 }));
        this.count++;
        return producto;
    };
    Memoria.prototype.updateProduct = function (ProductoActualizado, id) {
        var indexProducto = this.productos.findIndex(function (elemento) { return elemento.id === +id; });
        return this.productos[indexProducto] = __assign(__assign({}, ProductoActualizado), { id: +id });
    };
    Memoria.prototype.deleteProduct = function (id, productDelete) {
        var result = this.productos.filter(function (elemento) { return elemento.id !== +id; });
        this.productos = result;
        return productDelete;
    };
    return Memoria;
}());
exports.Memoria = Memoria;
