import { EstadoPedido } from "../enumerados/estado-pedido";
import { Producto } from "./producto";

export class ItemPedido {
    uid?: string = '';
    usuario: string = '';
    mesa: string = '';
    producto: Producto;
    cantidad: number = 0;
    estado: EstadoPedido;
}
