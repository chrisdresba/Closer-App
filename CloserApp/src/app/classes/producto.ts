import { TipoProducto } from 'src/app/enumerados/tipo-producto';

export class Producto {
    nombre: string = '';
    precio: number = 0;
    tiempo: number = 0;
    tipo: TipoProducto;
    estado?: string = '';
    fotos?: string[];
}
