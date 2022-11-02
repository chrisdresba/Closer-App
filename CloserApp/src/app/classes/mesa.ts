export declare type TipoMesa = "vip" | "discapacitados" | "estandar";
export declare type EstadoAtencion = "libre" | "ocupado" | "reservado";

export class Mesa {
    numero: number;
    usuario: string = '';
    nombre: string = '';
    estado: EstadoAtencion;
    tipo: TipoMesa;
    mozoAsignado = '';
    uid?: string = '';
}
