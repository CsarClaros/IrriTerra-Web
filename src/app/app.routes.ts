import { Routes } from '@angular/router';

/*
=========================
LAYOUTS
=========================
*/

import { MainLayout } from './layouts/main-layout/main-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

/*
=========================
PAGES PUBLICAS
=========================
*/

import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { Company } from './pages/company/company';
import { Events } from './pages/events/events';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';

/*
=========================
GUARDS
=========================
*/

import { authGuard } from './core/guards/auth.guard';

/*
=========================
DASHBOARD
=========================
*/

import { DashboardHome } from './dashboard/dashboard-home/dashboard-home';

/* SALES */

import { Sales } from './dashboard/sales/sales';
import { SalesList } from './dashboard/sales/sales-list/sales-list';
import { SalesReports } from './dashboard/sales/sales-reports/sales-reports';
import { SalesExport } from './dashboard/sales/sales-export/sales-export';

/* PRODUCTS ADMIN */

import { ProductsAdmin } from './dashboard/products-admin/products-admin';
import { ProductList } from './dashboard/products-admin/product-list/product-list';
import { ProductCreate } from './dashboard/products-admin/product-create/product-create';
import { ProductEdit } from './dashboard/products-admin/product-edit/product-edit';
import { StockReport } from './dashboard/products-admin/stock-report/stock-report';

/* USERS */

import { Users } from './dashboard/users/users';
import { UserList } from './dashboard/users/user-list/user-list';
import { UserCreate } from './dashboard/users/user-create/user-create';
import { Roles } from './dashboard/users/roles/roles';

/* SETTINGS */

import { Settings } from './dashboard/settings/settings';


export const routes: Routes = [

    /*
    =========================
    RUTAS PUBLICAS
    =========================
    */

    {
        path: '',
        component: MainLayout,
        children: [

            { path: '', component: Home },

            { path: 'productos', component: Products },

            { path: 'empresa', component: Company },

            { path: 'eventos', component: Events },

            { path: 'contactos', component: Contact },

            { path: 'login', component: Login }

        ]
    },

    /*
    =========================
    DASHBOARD PRIVADO
    =========================
    */

    {
        path: 'dashboard',
        component: DashboardLayout,
        canActivate: [authGuard],
        children: [

            { path: '', component: DashboardHome },

            /*
            =========================
            SALES
            =========================
            */

            {
                path: 'sales',
                component: Sales,
                children: [

                    { path: '', component: SalesList },

                    { path: 'reports', component: SalesReports },

                    { path: 'export', component: SalesExport }

                ]
            },

            /*
            =========================
            PRODUCTS ADMIN
            =========================
            */

            {
                path: 'products',
                component: ProductsAdmin,
                children: [

                    { path: '', component: ProductList },

                    { path: 'create', component: ProductCreate },

                    { path: 'edit/:id', component: ProductEdit },

                    { path: 'stock-report', component: StockReport }

                ]
            },

            /*
            =========================
            USERS
            =========================
            */

            {
                path: 'users',
                component: Users,
                children: [

                    { path: '', component: UserList },

                    { path: 'create', component: UserCreate },

                    { path: 'roles', component: Roles }

                ]
            },

            /*
            =========================
            SETTINGS
            =========================
            */

            {
                path: 'settings',
                component: Settings
            }

        ]
    },

    /*
    =========================
    REDIRECCION GLOBAL
    =========================
    */

    {
        path: '**',
        redirectTo: ''
    }

];