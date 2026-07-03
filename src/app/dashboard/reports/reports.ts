import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Download, TrendingUp, TrendingDown } from 'lucide-angular';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {

  Download = Download;
  TrendingUp = TrendingUp;
  TrendingDown = TrendingDown;

  reports = [
    {
      title: {
        es: 'Reporte de Ventas Mensual',
        en: 'Monthly Sales Report'
      },
      description: {
        es: 'Análisis detallado de ventas del mes actual',
        en: 'Detailed analysis of current month sales'
      },
      date: '2026-03-01 - 2026-03-26',
      status: 'completed'
    },
    {
      title: {
        es: 'Inventario y Stock',
        en: 'Inventory and Stock'
      },
      description: {
        es: 'Estado actual del inventario y productos',
        en: 'Current inventory and product status'
      },
      date: '2026-03-26',
      status: 'completed'
    },
    {
      title: {
        es: 'Rendimiento de Vendedores',
        en: 'Sales Performance'
      },
      description: {
        es: 'Métricas de desempeño del equipo de ventas',
        en: 'Sales team performance metrics'
      },
      date: '2026-03-01 - 2026-03-26',
      status: 'completed'
    }
  ];

}