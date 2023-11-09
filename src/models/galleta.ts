export interface Galleta {
    id?: string;
    nombre: string;
    inventario: number;
    precio: number;
    descripcion: string;
    cantidadLote: number;
    imagen: string;
    receta?: string;
    estatus: number;
    ingredientes?: [{
        materiaPrima: string;
        cantidad: number;
    }];
}