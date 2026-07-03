import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings, LogOut, Menu, X, Bell, User } from 'lucide-angular';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LucideAngularModule
  ],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayout {

  constructor(
    private router: Router,
    private lang: LanguageService
  ) {}

  isSidebarOpen = false;

  LayoutDashboard = LayoutDashboard;
  ShoppingCart = ShoppingCart;
  Package = Package;
  Users = Users;
  BarChart3 = BarChart3;
  Settings = Settings;
  LogOut = LogOut;
  Menu = Menu;
  X = X;
  Bell = Bell;
  User = User;

  menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: { es: 'Dashboard', en: 'Dashboard' }
    },
    {
      path: '/dashboard/sales',
      icon: ShoppingCart,
      label: { es: 'Ventas', en: 'Sales' }
    },
    {
      path: '/dashboard/products',
      icon: Package,
      label: { es: 'Productos', en: 'Products' }
    },
    {
      path: '/dashboard/users',
      icon: Users,
      label: { es: 'Usuarios', en: 'Users' }
    },
    {
      path: '/dashboard/reports',
      icon: BarChart3,
      label: { es: 'Reportes', en: 'Reports' }
    },
    {
      path: '/dashboard/settings',
      icon: Settings,
      label: { es: 'Configuración', en: 'Settings' }
    }
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  t(es: string, en: string) {
    return this.lang.t(es, en);
  }
}