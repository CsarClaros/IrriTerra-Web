import {
    Routes
} from '@angular/router';


/*
|--------------------------------------------------------------------------
| Layouts
|--------------------------------------------------------------------------
*/

import {
    MainLayout
} from './layouts/main-layout/main-layout';

import {
    DashboardLayout
} from './layouts/dashboard-layout/dashboard-layout';


/*
|--------------------------------------------------------------------------
| Páginas públicas
|--------------------------------------------------------------------------
*/

import {
    Home
} from './pages/home/home';

import {
    Products
} from './pages/products/products';

import {
    Company
} from './pages/company/company';

import {
    Events
} from './pages/events/events';

import {
    Contact
} from './pages/contact/contact';

import {
    Login
} from './pages/login/login';


/*
|--------------------------------------------------------------------------
| Guards
|--------------------------------------------------------------------------
*/

import {
    authGuard
} from './core/guards/auth.guard';

import {
    anyPermissionGuard,
    permissionGuard
} from './core/guards/permission-guard';


/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

import {
    Overview
} from './dashboard/overview/overview';


/*
|--------------------------------------------------------------------------
| Ventas
|--------------------------------------------------------------------------
*/

import {
    Sales
} from './dashboard/sales/sales';

import {
    SalesList
} from './dashboard/sales/sales-list/sales-list';

import {
    SalesReports
} from './dashboard/sales/sales-reports/sales-reports';

import {
    SalesExport
} from './dashboard/sales/sales-export/sales-export';


/*
|--------------------------------------------------------------------------
| Productos
|--------------------------------------------------------------------------
*/

import {
    ProductsAdmin
} from './dashboard/products-admin/products-admin';

import {
    ProductList
} from './dashboard/products-admin/product-list/product-list';

import {
    ProductCreate
} from './dashboard/products-admin/product-create/product-create';

import {
    ProductEdit
} from './dashboard/products-admin/product-edit/product-edit';

import {
    StockReport
} from './dashboard/products-admin/stock-report/stock-report';


/*
|--------------------------------------------------------------------------
| Usuarios
|--------------------------------------------------------------------------
*/

import {
    Users
} from './dashboard/users/users';

import {
    UserList
} from './dashboard/users/user-list/user-list';


import {
    Roles
} from './dashboard/users/roles/roles';


/*
|--------------------------------------------------------------------------
| Reportes
|--------------------------------------------------------------------------
*/

import {
    Reports
} from './dashboard/reports/reports';

import {
    ReportCenter
} from './dashboard/reports/report-center/report-center';

import {
    InventoryReport
} from './dashboard/reports/inventory-report/inventory-report';

import {
    PurchasesReport
} from './dashboard/reports/purchases-report/purchases-report';

import {
    TransfersReport
} from './dashboard/reports/transfers-report/transfers-report';


/*
|--------------------------------------------------------------------------
| Configuración
|--------------------------------------------------------------------------
*/

import {
    Settings
} from './dashboard/settings/settings';
import { SalesCreate } from './dashboard/sales/sales-create/sales-create';


import {
    TransferList
} from './dashboard/transfers/transfer-list/transfer-list';

import {
    TransferCreate
} from './dashboard/transfers/transfer-create/transfer-create';

/**
 * 
 * Compras
 * 
 */
import {
    PurchaseList
} from './dashboard/purchases/purchase-list/purchase-list';

import {
    PurchaseCreate
} from './dashboard/purchases/purchase-create/purchase-create';
import { ProductDetail } from './pages/product-detail/product-detail';

/*
|--------------------------------------------------------------------------
| Organización
|--------------------------------------------------------------------------
*/

import {
    EmpresaAdmin
} from './dashboard/organization/empresa/empresa';

/*
|--------------------------------------------------------------------------
| Sucursales
|--------------------------------------------------------------------------
*/

import {
    SucursalList
} from './dashboard/organization/sucursales/sucursal-list/sucursal-list';

import {
    SucursalForm
} from './dashboard/organization/sucursales/sucursal-form/sucursal-form';

/*
|--------------------------------------------------------------------------
| Categorías
|--------------------------------------------------------------------------
*/

import {
    CategoryList
} from './dashboard/products-admin/categories/category-list/category-list';

import {
    CategoryForm
} from './dashboard/products-admin/categories/category-form/category-form';


/*
|--------------------------------------------------------------------------
| Proveedores
|--------------------------------------------------------------------------
*/

import {
    ProviderList
} from './dashboard/purchases/providers/provider-list/provider-list';

import {
    ProviderForm
} from './dashboard/purchases/providers/provider-form/provider-form';




/*
|--------------------------------------------------------------------------
| Rutas
|--------------------------------------------------------------------------
*/

export const routes:
    Routes = [

        /*
        |--------------------------------------------------------------------------
        | Sitio público
        |--------------------------------------------------------------------------
        */

        {

            path: '',

            component:
                MainLayout,

            children: [

                {

                    path: '',

                    component:
                        Home

                },

                {

                    path: 'productos',

                    component:
                        Products

                },

                {
                    path: 'productos/:id',
                    component: ProductDetail
                },

                {

                    path: 'empresa',

                    component:
                        Company

                },

                {

                    path: 'eventos',

                    component:
                        Events

                },

                {

                    path: 'contactos',

                    component:
                        Contact

                },

                {

                    path: 'login',

                    component:
                        Login

                }

            ]

        },


        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        {

            path: 'dashboard',

            component:
                DashboardLayout,

            canActivate: [

                authGuard

            ],

            children: [

                /*
                |--------------------------------------------------------------------------
                | Inicio
                |--------------------------------------------------------------------------
                */

                {

                    path: '',

                    component:
                        Overview

                },


                /*
                |--------------------------------------------------------------------------
                | Ventas
                |--------------------------------------------------------------------------
                */


                {
                    path: 'sales/create',

                    component:
                        SalesCreate,

                    canActivate: [

                        permissionGuard(
                            'venta.crear'
                        )

                    ]
                },

                {
                    path: 'sales/:id/edit',

                    component:
                        SalesCreate,

                    canActivate: [
                        permissionGuard(
                            'venta.crear'
                        )
                    ]
                },

                {
                    path: 'sales/reports',

                    redirectTo:
                        'reports/sales',

                    pathMatch:
                        'full'
                },

                {
                    path: 'sales/export',

                    component:
                        SalesExport,

                    canActivate: [

                        permissionGuard(
                            'reporte_ventas.ver'
                        )

                    ]
                },

                {
                    path: 'sales',

                    component:
                        SalesList,

                    canActivate: [

                        permissionGuard(
                            'venta.ver'
                        )

                    ]
                },


                /*
                |--------------------------------------------------------------------------
                | Productos e inventario
                |--------------------------------------------------------------------------
                */

                {

                    path: 'products',

                    component:
                        ProductsAdmin,

                    canActivate: [

                        permissionGuard(
                            'producto.ver'
                        )

                    ],

                    children: [

                        {

                            path: '',

                            component:
                                ProductList

                        },

                        {

                            path: 'create',

                            component:
                                ProductCreate,

                            canActivate: [

                                permissionGuard(
                                    'producto.crear'
                                )

                            ]

                        },

                        {

                            path: 'edit/:id',

                            component:
                                ProductEdit,

                            canActivate: [

                                permissionGuard(
                                    'producto.editar'
                                )

                            ]

                        },

                        {

                            path: 'stock-report',

                            component:
                                StockReport,

                            canActivate: [

                                permissionGuard(
                                    'reporte_inventario.ver'
                                )

                            ]

                        }

                    ]

                },

                /**
                 * 
                 * Reports
                 * 
                 * 
                 */
                {
                    path:
                        'reports/inventory',

                    component:
                        InventoryReport,

                    canActivate: [
                        permissionGuard(
                            'reporte_inventario.ver'
                        )
                    ]
                },

                /*
|--------------------------------------------------------------------------
| Reporte de ventas
|--------------------------------------------------------------------------
*/

                {
                    path: 'reports/sales',

                    component:
                        SalesReports,

                    canActivate: [

                        permissionGuard(
                            'reporte_ventas.ver'
                        )

                    ]
                },


                {
                    path:
                        'reports/purchases',

                    component:
                        PurchasesReport,

                    canActivate: [
                        permissionGuard(
                            'reporte_compras.ver'
                        )
                    ]
                },

                {
                    path:
                        'reports/transfers',

                    component:
                        TransfersReport,

                    canActivate: [
                        permissionGuard(
                            'reporte_transferencias.ver'
                        )
                    ]
                },

                {
                    path:
                        'reports',

                    component:
                        ReportCenter
                },


                /*
                |--------------------------------------------------------------------------
                | Usuarios
                |--------------------------------------------------------------------------
                */

                {

                    path: 'users',

                    component:
                        Users,

                    canActivate: [

                        permissionGuard(
                            'usuario.ver'
                        )

                    ],

                    children: [

                        {

                            path: '',

                            component:
                                UserList

                        },


                        {

                            path: 'roles',

                            component:
                                Roles,

                            canActivate: [

                                permissionGuard(
                                    'rol.ver'
                                )

                            ]

                        }

                    ]

                },





                /*
                |--------------------------------------------------------------------------
                | Centro de reportes
                |--------------------------------------------------------------------------
                */

                {
                    path: 'reports',

                    component:
                        Reports,

                    canActivate: [

                        permissionGuard(

                            // 'reporte_inventario.ver',

                            'reporte_ventas.ver',

                            // 'reporte_compras.ver',

                            // 'reporte_transferencias.ver'

                        )

                    ]
                },

                /*
|--------------------------------------------------------------------------
| Empresa
|--------------------------------------------------------------------------
*/

                {
                    path: 'empresa',

                    component:
                        EmpresaAdmin,

                    canActivate: [
                        permissionGuard(
                            'empresa.ver'
                        )
                    ]
                },

                /*
|--------------------------------------------------------------------------
| Sucursales
|--------------------------------------------------------------------------
*/

                {
                    path:
                        'sucursales',

                    component:
                        SucursalList,

                    canActivate: [
                        permissionGuard(
                            'sucursal.ver'
                        )
                    ]
                },


                {
                    path:
                        'sucursales/crear',

                    component:
                        SucursalForm,

                    canActivate: [
                        permissionGuard(
                            'sucursal.crear'
                        )
                    ]
                },


                {
                    path:
                        'sucursales/:id/editar',

                    component:
                        SucursalForm,

                    canActivate: [
                        permissionGuard(
                            'sucursal.editar'
                        )
                    ]
                },


                /*
                |--------------------------------------------------------------------------
                | Configuración
                |--------------------------------------------------------------------------
                */

                {

                    path: 'settings',

                    component:
                        Settings

                },

                /*
|--------------------------------------------------------------------------
| Transferencias
|--------------------------------------------------------------------------
*/

                {
                    path: 'transfers/create',

                    component:
                        TransferCreate,

                    canActivate: [

                        permissionGuard(
                            'transferencia.crear'
                        )

                    ]
                },

                {
                    path: 'transfers/:id/edit',

                    component:
                        TransferCreate,

                    canActivate: [

                        permissionGuard(
                            'transferencia.editar'
                        )

                    ]
                },

                {
                    path: 'transfers',

                    component:
                        TransferList,

                    canActivate: [

                        permissionGuard(
                            'transferencia.ver'
                        )

                    ]
                },

                /*
|--------------------------------------------------------------------------
| Compras
|--------------------------------------------------------------------------
*/

                {
                    path:
                        'purchases/create',

                    component:
                        PurchaseCreate,

                    canActivate: [

                        permissionGuard(
                            'compra.crear'
                        )

                    ]
                },

                {
                    path:
                        'purchases/:id/edit',

                    component:
                        PurchaseCreate,

                    canActivate: [

                        permissionGuard(
                            'compra.editar'
                        )

                    ]
                },

                {
                    path:
                        'purchases',

                    component:
                        PurchaseList,

                    canActivate: [

                        permissionGuard(
                            'compra.ver'
                        )

                    ]
                },

                /*
|--------------------------------------------------------------------------
| Categorías
|--------------------------------------------------------------------------
*/

                {
                    path:
                        'categorias',

                    component:
                        CategoryList,

                    canActivate: [
                        permissionGuard(
                            'categoria.ver'
                        )
                    ]
                },


                {
                    path:
                        'categorias/crear',

                    component:
                        CategoryForm,

                    canActivate: [
                        permissionGuard(
                            'categoria.crear'
                        )
                    ]
                },


                {
                    path:
                        'categorias/:id/editar',

                    component:
                        CategoryForm,

                    canActivate: [
                        permissionGuard(
                            'categoria.editar'
                        )
                    ]
                },

                /*
|--------------------------------------------------------------------------
| Proveedores
|--------------------------------------------------------------------------
*/

                {
                    path:
                        'proveedores',

                    component:
                        ProviderList,

                    canActivate: [
                        permissionGuard(
                            'proveedor.ver'
                        )
                    ]
                },


                {
                    path:
                        'proveedores/crear',

                    component:
                        ProviderForm,

                    canActivate: [
                        permissionGuard(
                            'proveedor.crear'
                        )
                    ]
                },


                {
                    path:
                        'proveedores/:id/editar',

                    component:
                        ProviderForm,

                    canActivate: [
                        permissionGuard(
                            'proveedor.editar'
                        )
                    ]
                },

            ]

        },


        /*
        |--------------------------------------------------------------------------
        | Ruta desconocida
        |--------------------------------------------------------------------------
        */

        {

            path: '**',

            redirectTo: ''

        }

    ];