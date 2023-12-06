export interface Proveedor {
    id?: string;
    nombre: string;
    telefono: string;
    empresa: string;
    direccion: string;
    email: string;
    producto: {
        producto: string;
        costo: number;
    }
    estatus: number;
}