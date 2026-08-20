import {
  Component,
  computed,
  inject
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
  ArrowRightLeft
} from 'lucide-angular';

import {
  LanguageService
} from '../../core/services/language.service';

import {
  SessionService
} from '../../core/services/session.service';


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
export class DashboardLayout {

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


  /*
  |--------------------------------------------------------------------------
  | Sidebar
  |--------------------------------------------------------------------------
  */

  isSidebarOpen =
    false;


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

      {

        path:
          '/dashboard/sales',

        icon:
          ShoppingCart,

        label: {

          es:
            'Ventas',

          en:
            'Sales'

        },

        permisos: [
          'venta.ver'
        ]

      },

      {

        path:
          '/dashboard/transfers',

        icon:
          ArrowRightLeft,

        label: {

          es:
            'Transferencias',

          en:
            'Transfers'

        },

        permisos: [
          'transferencia.ver'
        ]

      },

      {
        path:
          '/dashboard/purchases',

        icon:
          ShoppingCart,

        label: {
          es: 'Compras',

          en: 'Purchases'
        },

        permisos: [
          'compra.ver'
        ]
      },

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


      {

        path:
          '/dashboard/settings',

        icon:
          Settings,

        label: {

          es:
            'Configuración',

          en:
            'Settings'

        }

      }

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
  | Logout
  |--------------------------------------------------------------------------
  */

  logout(): void {

    this.router.navigate(
      [
        '/login'
      ]
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

    return this.lang.t(
      es,
      en
    );

  }

}