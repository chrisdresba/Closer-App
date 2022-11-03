import { ValidacionUsuario } from 'src/app/enumerados/validacion-usuario'

export class Cliente {
    nombre: string = '';
    apellido: string = '';
    dni: number = 0;
    perfil: string = '';
    email: string = '';
    password: string = '';
    fotoURL?: string;
    uid?: string = '';
    validacion?: ValidacionUsuario;
    estado?: string = '';
}
