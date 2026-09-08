import {
  Component,
  computed,
  inject,
  OnInit,
  HostListener,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LogOut,
  LucideAngularModule,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  User,
  Users,
  X,
  ArrowRightLeft,
  Building2,
  MapPinned,
  Tags,
  Truck,
  ContactRound,
  BadgeCheck,
  ChevronDown
} from 'lucide-angular';

import {
  LanguageService
} from '../../core/services/language.service';

import {
  SessionService
} from '../../core/services/session.service';


import {
  AuthService
} from '../../core/services/auth.service';


import {
  finalize
} from 'rxjs/operators';

import {
  SeoService
} from '../../core/services/seo.service';



interface MenuItem {

  path:
  string;

  icon:
  typeof LayoutDashboard;

  label: {

    es:
    string;

    en:
    string;

  };

  permisos?:
  string[];

}


@Component({
  selector:
    'app-dashboard-layout',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LucideAngularModule
  ],

  templateUrl:
    './dashboard-layout.html',

  styleUrls: [
    './dashboard-layout.css'
  ]
})
export class DashboardLayout implements OnInit {



  ngOnInit(): void {

    this.seoService
      .configurar(
        {
          title:
            'Sistema de gestión | Irriterra S.R.L.',

          description:
            'Área privada de gestión de Irriterra S.R.L.',

          path:
            '/dashboard',

          robots:
            'noindex, nofollow'
        }
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly router =
    inject(
      Router
    );


  private readonly lang =
    inject(
      LanguageService
    );


  private readonly sessionService =
    inject(
      SessionService
    );

  private readonly authService =
    inject(
      AuthService
    );

  private readonly seoService =
    inject(
      SeoService
    );

  /*
  |--------------------------------------------------------------------------
  | Sidebar
  |--------------------------------------------------------------------------
  */

  isSidebarOpen =
    false;

  /*
|--------------------------------------------------------------------------
| Menú de usuario
|--------------------------------------------------------------------------
*/

  readonly userMenuOpen =
    signal(
      false
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly LayoutDashboard =
    LayoutDashboard;

  readonly ShoppingCart =
    ShoppingCart;

  readonly Package =
    Package;

  readonly Users =
    Users;

  readonly BarChart3 =
    BarChart3;

  readonly Settings =
    Settings;

  readonly LogOut =
    LogOut;

  readonly Menu =
    Menu;

  readonly X =
    X;

  readonly Bell =
    Bell;

  readonly User =
    User;

  readonly ArrowRightLeft =
    ArrowRightLeft;

  readonly Building2 =
    Building2;

  readonly MapPinned =
    MapPinned;

  readonly Tags =
    Tags;

  readonly Truck =
    Truck;

  readonly ContactRound =
    ContactRound;

  readonly BadgeCheck =
    BadgeCheck;

  readonly ChevronDown =
    ChevronDown;


  /*
  |--------------------------------------------------------------------------
  | Menú
  |--------------------------------------------------------------------------
  */

  private readonly menuItems:
    MenuItem[] = [

      {

        path:
          '/dashboard',

        icon:
          LayoutDashboard,

        label: {

          es:
            'Dashboard',

          en:
            'Dashboard'

        }

      },

      // {

      //   path:
      //     '/dashboard/sales',

      //   icon:
      //     ShoppingCart,

      //   label: {

      //     es:
      //       'Ventas',

      //     en:
      //       'Sales'

      //   },

      //   permisos: [
      //     'venta.ver'
      //   ]

      // },

      // {
      //   path:
      //     '/dashboard/clientes',

      //   icon:
      //     ContactRound,

      //   label: {

      //     es:
      //       'Clientes',

      //     en:
      //       'Clients'

      //   },

      //   permisos: [
      //     'cliente.ver'
      //   ]
      // },

      // {

      //   path:
      //     '/dashboard/transfers',

      //   icon:
      //     ArrowRightLeft,

      //   label: {

      //     es:
      //       'Transferencias',

      //     en:
      //       'Transfers'

      //   },

      //   permisos: [
      //     'transferencia.ver'
      //   ]

      // },

      // {
      //   path:
      //     '/dashboard/purchases',

      //   icon:
      //     ShoppingCart,

      //   label: {
      //     es: 'Compras',

      //     en: 'Purchases'
      //   },

      //   permisos: [
      //     'compra.ver'
      //   ]
      // },

      // {
      //   path:
      //     '/dashboard/proveedores',

      //   icon:
      //     Truck,

      //   label: {

      //     es:
      //       'Proveedores',

      //     en:
      //       'Providers'

      //   },

      //   permisos: [
      //     'proveedor.ver'
      //   ]
      // },

      {

        path:
          '/dashboard/products',

        icon:
          Package,

        label: {

          es:
            'Productos',

          en:
            'Products'

        },

        permisos: [
          'producto.ver'
        ]

      },

      {
        path:
          '/dashboard/categorias',

        icon:
          Tags,

        label: {

          es:
            'Categorías',

          en:
            'Categories'

        },

        permisos: [
          'categoria.ver'
        ]
      },

      {
        path:
          '/dashboard/marcas',

        icon:
          BadgeCheck,

        label: {

          es:
            'Marcas',

          en:
            'Brands'

        },

        permisos: [
          'marca.ver'
        ]
      },

      // {
      //   path:
      //     '/dashboard/empresa',

      //   icon:
      //     Building2,

      //   label: {

      //     es:
      //       'Empresa',

      //     en:
      //       'Company'

      //   },

      //   permisos: [
      //     'empresa.ver'
      //   ]
      // },

      // {
      //   path:
      //     '/dashboard/sucursales',

      //   icon:
      //     MapPinned,

      //   label: {

      //     es:
      //       'Sucursales',

      //     en:
      //       'Branches'

      //   },

      //   permisos: [
      //     'sucursal.ver'
      //   ]
      // },


      {

        path:
          '/dashboard/users',

        icon:
          Users,

        label: {

          es:
            'Usuarios',

          en:
            'Users'

        },

        permisos: [
          'usuario.ver'
        ]

      },

      {

        path:
          '/dashboard/reports',

        icon:
          BarChart3,

        label: {

          es:
            'Reportes',

          en:
            'Reports'

        },

        permisos: [

          'reporte_inventario.ver',

          'reporte_ventas.ver',

          'reporte_compras.ver',

          'reporte_transferencias.ver'

        ]

      },


    ];


  /*
  |--------------------------------------------------------------------------
  | Menú visible
  |--------------------------------------------------------------------------
  */

  readonly menuItemsVisibles =
    computed(
      () =>
        this.menuItems
          .filter(
            item => {

              /*
               * Sin permisos específicos:
               * siempre visible.
               */

              if (
                !item.permisos
                ||
                item.permisos.length
                === 0
              ) {

                return true;

              }


              /*
               * Con permisos:
               * basta tener uno.
               */

              return this.sessionService
                .tieneAlgunPermiso(
                  item.permisos
                );

            }
          )
    );

  /*
|--------------------------------------------------------------------------
| Usuario autenticado
|--------------------------------------------------------------------------
*/

  readonly usuario =
    this.sessionService.usuario;


  readonly nombreCompleto =
    computed(
      () => {

        const usuario =
          this.usuario();

        if (!usuario) {

          return '';

        }


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
    );


  readonly rolActual =
    computed(
      () =>
        this.usuario()
          ?.rol
          ?.nombre
        ?? ''
    );


  readonly correoActual =
    computed(
      () =>
        this.usuario()
          ?.correo
        ?? ''
    );


  readonly fotoActual =
    computed(
      () =>
        this.usuario()
          ?.foto
        ?? null
    );


  readonly iniciales =
    computed(
      () => {

        const usuario =
          this.usuario();

        if (!usuario) {

          return 'U';

        }


        const nombre =
          usuario.nombre
            ?.trim()
            .charAt(0)
            .toUpperCase()
          ?? '';


        const apellido =
          usuario.apellido_paterno
            ?.trim()
            .charAt(0)
            .toUpperCase()
          ?? '';


        return (
          `${nombre}${apellido}`
          || 'U'
        );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | Sidebar
  |--------------------------------------------------------------------------
  */

  toggleSidebar(): void {

    this.isSidebarOpen =
      !this.isSidebarOpen;

  }


  closeSidebar(): void {

    this.isSidebarOpen =
      false;

  }


  /*
|--------------------------------------------------------------------------
| Menú de usuario
|--------------------------------------------------------------------------
*/

  toggleUserMenu(
    event:
      MouseEvent
  ): void {

    /*
     * Evita que el click llegue al
     * listener global y cierre
     * inmediatamente el menú.
     */

    event.stopPropagation();


    this.userMenuOpen.update(
      abierto =>
        !abierto
    );

  }


  closeUserMenu(): void {

    this.userMenuOpen.set(
      false
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Cerrar al hacer click fuera
  |--------------------------------------------------------------------------
  */

  @HostListener(
    'document:click'
  )
  onDocumentClick(): void {

    this.closeUserMenu();

  }


  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  logout(): void {

    this.closeUserMenu();

    this.authService
      .logout()
      .pipe(

        finalize(
          () => {

            this.router.navigate(
              [
                '/login'
              ]
            );

          }
        )

      )
      .subscribe({

        error:
          () => {

            /*
             * AuthService limpia la sesión
             * incluso si Laravel no responde.
             */

          }

      });

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

    return this.lang.t(
      es,
      en
    );

  }

}