export interface Provision {
    id?: string;
    proveedor: string;
    materiaPrima: string;
    cantidad: number;
    costoTotal: number;
    fechaPedido: Date;
    fechaEntrega?: Date;
    estatus: number;
}