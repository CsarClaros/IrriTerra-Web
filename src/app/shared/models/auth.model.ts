import { UsuarioAutenticado} from "./user.model";

/*

Login

*/ 

export interface LoginRequest{

    usuario: string;

    contrasena: string;
}

export interface LoginResponse{

    message?: string;

    token: string;

    token_type?: string;

    usuario: UsuarioAutenticado;

}

/*

Sesion

*/

export interface AuthSession{

    token: string;

    tokenType: string;

    usuario: UsuarioAutenticado;

}

/*

Camgio de contraseña

*/

export interface CambiarContrasenaRequest{

    contrasena_actual: string;
    
    nueva_contrasena: string;

    nueva_contrasena_confirmation: string;

}

/**
 * 
 * Respuesta Simple
 * 
 */

export interface MessageResponse{

    message: string;

}

/*
|--------------------------------------------------------------------------
| Laravel Resource
|--------------------------------------------------------------------------
*/

export interface ResourceResponse<T> {

    data: T;

}

export interface ActualizarPerfilRequest {

    correo:
        string | null;

    telefono:
        string | null;

    direccion:
        string | null;

}