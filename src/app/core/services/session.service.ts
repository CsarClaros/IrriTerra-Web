import {
    computed,
    Injectable,
    signal
} from '@angular/core';

import {
    AuthSession
} from '../../shared/models/auth.model';

import {
    UsuarioAutenticado
} from '../../shared/models/user.model';


@Injectable({
    providedIn: 'root'
})
export class SessionService {

    /*
    |--------------------------------------------------------------------------
    | Configuración
    |--------------------------------------------------------------------------
    */

    private readonly storageKey =
        'irriterra_session';


    /*
    |--------------------------------------------------------------------------
    | Storage
    |--------------------------------------------------------------------------
    */

    private readonly storage: Storage | null =
        typeof window !== 'undefined'
            ? window.sessionStorage
            : null;


    /*
    |--------------------------------------------------------------------------
    | Estado interno
    |--------------------------------------------------------------------------
    */

    private readonly sessionState =
        signal<AuthSession | null>(
            this.loadSession()
        );


    /*
    |--------------------------------------------------------------------------
    | Estado público
    |--------------------------------------------------------------------------
    */

    readonly session =
        this.sessionState.asReadonly();


    readonly usuario =
        computed(
            () =>
                this.sessionState()
                    ?.usuario
                ?? null
        );


    readonly token =
        computed(
            () =>
                this.sessionState()
                    ?.token
                ?? null
        );


    readonly permisos =
        computed(
            () =>
                this.sessionState()
                    ?.usuario
                    .permisos
                ?? []
        );


    readonly autenticado =
        computed(
            () =>
                Boolean(
                    this.sessionState()
                        ?.token
                )
        );


    readonly rol =
        computed(
            () =>
                this.sessionState()
                    ?.usuario
                    .rol
                ?? null
        );


    readonly sucursal =
        computed(
            () =>
                this.sessionState()
                    ?.usuario
                    .sucursal
                ?? null
        );


    /*
    |--------------------------------------------------------------------------
    | Guardar sesión
    |--------------------------------------------------------------------------
    */

    guardarSesion(
        session: AuthSession
    ): void {

        this.sessionState.set(
            session
        );

        this.storage?.setItem(

            this.storageKey,

            JSON.stringify(
                session
            )

        );
    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar usuario
    |--------------------------------------------------------------------------
    */

    actualizarUsuario(
        usuario: UsuarioAutenticado
    ): void {

        const session =
            this.sessionState();

        if (! session) {

            return;

        }

        const updatedSession: AuthSession = {

            ...session,

            usuario

        };

        this.guardarSesion(
            updatedSession
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Eliminar sesión
    |--------------------------------------------------------------------------
    */

    limpiarSesion(): void {

        this.sessionState.set(
            null
        );

        this.storage?.removeItem(
            this.storageKey
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Comprobaciones
    |--------------------------------------------------------------------------
    */

    tienePermiso(
        permiso: string
    ): boolean {

        return this.permisos()
            .includes(
                permiso
            );
    }


    tieneAlgunPermiso(
        permisos: string[]
    ): boolean {

        return permisos.some(
            permiso =>
                this.tienePermiso(
                    permiso
                )
        );
    }


    tieneTodosLosPermisos(
        permisos: string[]
    ): boolean {

        return permisos.every(
            permiso =>
                this.tienePermiso(
                    permiso
                )
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Recuperar sesión
    |--------------------------------------------------------------------------
    */

    private loadSession():
        AuthSession | null {

        const rawSession =
            this.storage?.getItem(
                this.storageKey
            );

        if (! rawSession) {

            return null;

        }

        try {

            return JSON.parse(
                rawSession
            ) as AuthSession;

        } catch {

            this.storage
                ?.removeItem(
                    this.storageKey
                );

            return null;

        }
    }

}