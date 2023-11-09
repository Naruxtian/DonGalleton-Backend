export interface pedido{
    id?: string;
    usuario: string;
    fecha: Date;
    direccion: string;
    total: number;
    estatus: number;
    galletas: [{
        galleta: string;
        cantidad: number;
    }];
}