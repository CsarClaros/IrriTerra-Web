import {
  Component,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  finalize
} from 'rxjs';

import {
  CircleAlert,
  Lock,
  User,
  LucideAngularModule
} from 'lucide-angular';

import {
  AuthService
} from '../../core/services/auth.service';

import {
  LanguageService
} from '../../core/services/language.service';


type TipoMensaje =
  'error' |
  'warning' |
  'info';


@Component({
  selector: 'app-login',

  imports: [
      CommonModule,
      FormsModule,
      LucideAngularModule
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'
})
export class Login {

  /*
  |--------------------------------------------------------------------------
  | Formulario
  |--------------------------------------------------------------------------
  */

  formData = {

      usuario: '',

      contrasena: ''

  };


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly cargando =
      signal(false);


  readonly errorMensaje =
      signal('');


  readonly tipoMensaje =
      signal<TipoMensaje>(
          'error'
      );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly User =
      User;

  readonly Lock =
      Lock;

  readonly CircleAlert =
      CircleAlert;


  /*
  |--------------------------------------------------------------------------
  | Constructor
  |--------------------------------------------------------------------------
  */

  constructor(

      private readonly router:
          Router,

      private readonly route:
          ActivatedRoute,

      private readonly authService:
          AuthService,

      private readonly languageService:
          LanguageService

  ) {}


  /*
  |--------------------------------------------------------------------------
  | Traducción
  |--------------------------------------------------------------------------
  */

  t(
      es: string,
      en: string
  ): string {

      return this.languageService
          .t(
              es,
              en
          );

  }


  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  handleSubmit(): void {

      if (
          this.cargando()
          ||
          ! this.formData
              .usuario
              .trim()
          ||
          ! this.formData
              .contrasena
      ) {

          return;

      }


      this.cargando.set(
          true
      );


      this.limpiarMensaje();


      this.authService
          .login({

              usuario:
                  this.formData
                      .usuario
                      .trim()
                      .toLowerCase(),

              contrasena:
                  this.formData
                      .contrasena

          })
          .pipe(

              finalize(
                  () => {

                      this.cargando.set(
                          false
                      );

                  }
              )

          )
          .subscribe({

              next: () => {

                  const destination =
                      this.obtenerRutaDestino();


                  void this.router
                      .navigateByUrl(
                          destination
                      );

              },


              error: (
                  error:
                      HttpErrorResponse
              ) => {

                  this.procesarError(
                      error
                  );

              }

          });

  }


  /*
  |--------------------------------------------------------------------------
  | Ruta después del login
  |--------------------------------------------------------------------------
  */

  private obtenerRutaDestino():
      string {

      const returnUrl =
          this.route
              .snapshot
              .queryParamMap
              .get(
                  'returnUrl'
              );


      if (
          returnUrl
          &&
          returnUrl.startsWith(
              '/dashboard'
          )
      ) {

          return returnUrl;

      }


      return '/dashboard';

  }


  /*
  |--------------------------------------------------------------------------
  | Procesar error
  |--------------------------------------------------------------------------
  */

  private procesarError(
      error: HttpErrorResponse
  ): void {

      const serverMessage =
          this.obtenerMensajeServidor(
              error
          );


      switch (
          error.status
      ) {

          /*
           * Sin conexión.
           */

          case 0:

              this.tipoMensaje.set(
                  'info'
              );

              this.errorMensaje.set(

                  serverMessage
                  ??
                  this.t(

                      'No se pudo conectar con el servidor.',

                      'Could not connect to the server.'

                  )

              );

              break;


          /*
           * Credenciales incorrectas.
           */

          case 401:

              this.tipoMensaje.set(
                  'error'
              );

              this.errorMensaje.set(

                  serverMessage
                  ??
                  this.t(

                      'Usuario o contraseña incorrectos.',

                      'Incorrect username or password.'

                  )

              );

              break;


          /*
           * Cuenta inactiva.
           */

          case 403:

              this.tipoMensaje.set(
                  'warning'
              );

              this.errorMensaje.set(

                  serverMessage
                  ??
                  this.t(

                      'La cuenta no tiene acceso al sistema.',

                      'The account does not have access to the system.'

                  )

              );

              break;


          /*
           * Cuenta bloqueada.
           */

          case 423:

              this.tipoMensaje.set(
                  'warning'
              );

              this.errorMensaje.set(

                  serverMessage
                  ??
                  this.t(

                      'La cuenta se encuentra bloqueada temporalmente.',

                      'The account is temporarily locked.'

                  )

              );

              break;


          /*
           * Validación Laravel.
           */

          case 422:

              this.tipoMensaje.set(
                  'error'
              );

              this.errorMensaje.set(

                  serverMessage
                  ??
                  this.t(

                      'Verifique los datos ingresados.',

                      'Check the entered data.'

                  )

              );

              break;


          /*
           * Demasiados intentos.
           */

          case 429:

              this.tipoMensaje.set(
                  'warning'
              );

              this.errorMensaje.set(

                  serverMessage
                  ??
                  this.t(

                      'Demasiados intentos. Intente nuevamente más tarde.',

                      'Too many attempts. Try again later.'

                  )

              );

              break;


          /*
           * Otros errores.
           */

          default:

              this.tipoMensaje.set(
                  'error'
              );

              this.errorMensaje.set(

                  serverMessage
                  ??
                  this.t(

                      'Ocurrió un error al iniciar sesión.',

                      'An error occurred while signing in.'

                  )

              );

              break;

      }

  }


  /*
  |--------------------------------------------------------------------------
  | Mensaje Laravel
  |--------------------------------------------------------------------------
  */

  private obtenerMensajeServidor(
      error: HttpErrorResponse
  ): string | null {

      const message =
          error.error
              ?.message;


      if (
          typeof message === 'string'
          &&
          message.trim()
      ) {

          return message;

      }


      return null;

  }


  /*
  |--------------------------------------------------------------------------
  | Limpiar mensaje
  |--------------------------------------------------------------------------
  */

  private limpiarMensaje(): void {

      this.errorMensaje.set(
          ''
      );

  }

}