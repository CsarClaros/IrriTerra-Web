export interface RolResumen{

    id_rol: number;

    nombre: string;
}

export interface SucursalResumen{

    id_sucursal: number;

    nombre: string;
}

export interface Usuario{

    id_usuario: number;

    ci: string;

    usuario: string;

    nombre: string;

    apellido_paterno: string;

    apellido_materno: string | null;

    correo: string | null;

    telefono: string | null;

    direccion: string | null;

    foto: string | null;

    ultimo_acceso: string | null;
    
    estado_registro: string;

    rol: RolResumen | null;

    sucursal: SucursalResumen | null;

    permisos?: string[];

    created_at: string | null;

    updated_at: string | null;
}

export interface UsuarioAutenticado
    extends Usuario{

        permisos: string[];

    }