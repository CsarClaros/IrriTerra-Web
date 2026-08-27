import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  finalize
} from 'rxjs';

import {
  Edit3,
  LucideAngularModule,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  Users
} from 'lucide-angular';

import {
  UsuarioService
} from '../../../core/services/seguridad/usuario.service';

import {
  SessionService
} from '../../../core/services/session.service';

import {
  LanguageService
} from '../../../core/services/language.service';

import {
  Usuario
} from '../../../shared/models/user.model';

import {
  ModoFormularioUsuario
} from '../../../shared/models/usuario-form.model';

import {
  UserFormModal
} from '../user-form-modal/user-form-modal';


@Component({
  selector:
    'app-user-list',

  standalone:
    true,

  imports: [
    CommonModule,
    LucideAngularModule,
    UserFormModal
  ],

  templateUrl:
    './user-list.html',

  styleUrl:
    './user-list.css'
})
export class UserList
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly usuarioService =
    inject(
      UsuarioService
    );


  private readonly sessionService =
    inject(
      SessionService
    );


  private readonly languageService =
    inject(
      LanguageService
    );


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly usuarios =
    signal<
      Usuario[]
    >(
      []
    );


  readonly cargando =
    signal(
      false
    );


  readonly errorMensaje =
    signal(
      ''
    );


  readonly mensajeExito =
    signal(
      ''
    );


  readonly busqueda =
    signal(
      ''
    );


  readonly procesandoId =
    signal<
      number | null
    >(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Modal
  |--------------------------------------------------------------------------
  */

  readonly modalAbierto =
    signal(
      false
    );


  readonly modoModal =
    signal<
      ModoFormularioUsuario
    >(
      'CREAR'
    );


  readonly usuarioSeleccionado =
    signal<
      Usuario | null
    >(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Permisos
  |--------------------------------------------------------------------------
  */

  readonly puedeCrear =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'usuario.crear'
          )
    );


  readonly puedeEditar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'usuario.editar'
          )
    );


  readonly puedeEliminar =
    computed(
      () =>
        this.sessionService
          .tienePermiso(
            'usuario.eliminar'
          )
    );


  /*
  |--------------------------------------------------------------------------
  | Filtro
  |--------------------------------------------------------------------------
  */

  readonly usuariosFiltrados =
    computed(
      () => {

        const termino =
          this.busqueda()
            .trim()
            .toLowerCase();


        if (
          !termino
        ) {

          return this.usuarios();

        }


        return this.usuarios()
          .filter(
            usuario => {

              const texto = [

                usuario.ci,

                usuario.usuario,

                usuario.nombre,

                usuario.apellido_paterno,

                usuario.apellido_materno,

                usuario.correo,

                usuario.telefono,

                usuario.rol
                  ?.nombre,

                usuario.sucursal
                  ?.nombre

              ]
                .filter(
                  Boolean
                )
                .join(
                  ' '
                )
                .toLowerCase();


              return texto.includes(
                termino
              );

            }
          );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly Edit3 =
    Edit3;


  readonly Plus =
    Plus;


  readonly RefreshCcw =
    RefreshCcw;


  readonly Search =
    Search;


  readonly Trash2 =
    Trash2;


  readonly Users =
    Users;


  /*
  |--------------------------------------------------------------------------
  | Inicialización
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarUsuarios();

  }


  /*
  |--------------------------------------------------------------------------
  | Listar
  |--------------------------------------------------------------------------
  */

  cargarUsuarios(): void {

    if (
      this.cargando()
    ) {

      return;

    }


    this.cargando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    this.usuarioService
      .listar()
      .pipe(

        finalize(
          () =>
            this.cargando
              .set(
                false
              )
        )

      )
      .subscribe({

        next:
          response => {

            this.usuarios.set(
              response.data
            );

          },


        error:
          (
            error:
              HttpErrorResponse
          ) => {

            this.errorMensaje.set(
              this.mensajeError(
                error
              )
            );

          }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Crear
  |--------------------------------------------------------------------------
  */

  abrirCrear(): void {

    if (
      !this.puedeCrear()
    ) {

      return;

    }


    this.modoModal.set(
      'CREAR'
    );


    this.usuarioSeleccionado.set(
      null
    );


    this.modalAbierto.set(
      true
    );


    this.mensajeExito.set(
      ''
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Editar
  |--------------------------------------------------------------------------
  */

  abrirEditar(
    usuario:
      Usuario
  ): void {

    if (
      !this.puedeEditar()
    ) {

      return;

    }


    this.modoModal.set(
      'EDITAR'
    );


    this.usuarioSeleccionado.set(
      usuario
    );


    this.modalAbierto.set(
      true
    );


    this.mensajeExito.set(
      ''
    );

  }


  cerrarModal(): void {

    this.modalAbierto.set(
      false
    );


    this.usuarioSeleccionado.set(
      null
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Guardado
  |--------------------------------------------------------------------------
  */

  usuarioGuardado(
    usuario:
      Usuario
  ): void {

    const eraCreacion =
      this.modoModal()
      === 'CREAR';


    this.cerrarModal();


    if (
      eraCreacion
    ) {

      this.mensajeExito.set(

        this.t(
          `Usuario ${usuario.usuario} registrado correctamente. La contraseña inicial corresponde al CI registrado.`,
          `User ${usuario.usuario} registered successfully. The initial password is the registered ID number.`
        )

      );

    } else {

      this.mensajeExito.set(
        this.t(
          'Usuario actualizado correctamente.',
          'User updated successfully.'
        )
      );

    }


    this.cargarUsuarios();

  }


  /*
  |--------------------------------------------------------------------------
  | Desactivar
  |--------------------------------------------------------------------------
  */

  desactivar(
    usuario:
      Usuario
  ): void {

    if (
      !this.puedeEliminar()
    ) {

      return;

    }


    const confirmar =
      window.confirm(

        this.t(
          `¿Desactivar al usuario ${usuario.usuario}?`,
          `Deactivate user ${usuario.usuario}?`
        )

      );


    if (
      !confirmar
    ) {

      return;

    }


    this.procesandoId.set(
      usuario.id_usuario
    );


    this.errorMensaje.set(
      ''
    );


    this.mensajeExito.set(
      ''
    );


    this.usuarioService
      .eliminar(
        usuario.id_usuario
      )
      .pipe(

        finalize(
          () =>
            this.procesandoId
              .set(
                null
              )
        )

      )
      .subscribe({

        next:
          () => {

            this.mensajeExito.set(
              this.t(
                'Usuario desactivado correctamente.',
                'User deactivated successfully.'
              )
            );


            this.cargarUsuarios();

          },


        error:
          (
            error:
              HttpErrorResponse
          ) => {

            this.errorMensaje.set(
              this.mensajeError(
                error
              )
            );

          }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Presentación
  |--------------------------------------------------------------------------
  */

  nombreCompleto(
    usuario:
      Usuario
  ): string {

    return [

      usuario.nombre,

      usuario.apellido_paterno,

      usuario.apellido_materno

    ]
      .filter(
        Boolean
      )
      .join(
        ' '
      );

  }


  iniciales(
    usuario:
      Usuario
  ): string {

    return (

      (
        usuario.nombre
          ?.charAt(0)
        ?? ''
      )

      +

      (
        usuario
          .apellido_paterno
          ?.charAt(0)
        ?? ''
      )

    )
      .toUpperCase();

  }


  nombreEstado(
    estado:
      string
  ): string {

    return estado
      === 'A'

      ? this.t(
        'Activo',
        'Active'
      )

      : this.t(
        'Inactivo',
        'Inactive'
      );

  }


  claseEstado(
    estado:
      string
  ): string {

    return estado
      === 'A'

      ? 'bg-emerald-100 text-emerald-700'

      : 'bg-red-100 text-red-700';

  }


  actualizarBusqueda(
    event:
      Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    this.busqueda.set(
      input.value
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Idioma
  |--------------------------------------------------------------------------
  */

  t(
    es:
      string,

    en:
      string
  ): string {

    return this.languageService
      .t(
        es,
        en
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Errores
  |--------------------------------------------------------------------------
  */

  private mensajeError(
    error:
      HttpErrorResponse
  ): string {

    if (
      error.status === 0
    ) {

      return this.t(
        'No fue posible conectar con el servidor.',
        'Unable to connect to the server.'
      );

    }


    if (
      error.status === 403
    ) {

      return this.t(
        'No tiene permisos para realizar esta operación.',
        'You do not have permission to perform this operation.'
      );

    }


    if (
      typeof error.error
        ?.message
      === 'string'
    ) {

      return error.error.message;

    }


    return this.t(
      'No fue posible procesar la operación.',
      'Unable to process the operation.'
    );

  }

}