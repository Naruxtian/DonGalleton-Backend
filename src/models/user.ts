export interface User {
    id?: string;
    nombre: string;
    email: string;
    password: string;
    rol: string;
    telefono: string;
    direccion: string;
    carrito?: [{
        galleta: string;
        cantidad: number;
    }];
}