import { ItemPedido } from "./item-pedido";

export class Pedido {
    uid?: string = ''
    usuario: string = '';
    mesa: string = '';
    // productos: Array<ItemPedido>;
    productos: Array<string>;
    precioAcumulado: number = 0;
    estado: string = '';
    descuento: number = 0;
    propina: number = 0;
    uidEncuesta?: string = '';
}
