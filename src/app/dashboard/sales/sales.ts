import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Download, Filter } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
})
export class Sales {

  Download = Download;
  Filter = Filter;

  filters = {
    fecha: '',
    vendedor: '',
    producto: '',
  };

  ventas = [
    {
      id: 1,
      fecha: '2026-03-15',
      producto: 'Sistema Goteo Premium',
      vendedor: 'Juan Pérez',
      cantidad: 5,
      precio: 1200,
      total: 6000,
    },
    {
      id: 2,
      fecha: '2026-03-16',
      producto: 'Aspersor Giratorio 360°',
      vendedor: 'María González',
      cantidad: 10,
      precio: 350,
      total: 3500,
    },
    {
      id: 3,
      fecha: '2026-03-17',
      producto: 'Controlador Smart WiFi',
      vendedor: 'Carlos Mamani',
      cantidad: 3,
      precio: 800,
      total: 2400,
    },
    {
      id: 4,
      fecha: '2026-03-18',
      producto: 'Filtro de Disco Industrial',
      vendedor: 'Juan Pérez',
      cantidad: 8,
      precio: 450,
      total: 3600,
    },
    {
      id: 5,
      fecha: '2026-03-19',
      producto: 'Sensor de Humedad',
      vendedor: 'María González',
      cantidad: 12,
      precio: 180,
      total: 2160,
    },
  ];

  setFilter(field: string, value: string) {
    (this.filters as any)[field] = value;
  }

  exportPDF() {
    alert('Exportando a PDF...');
  }

  exportExcel() {
    alert('Exportando a Excel...');
  }

  get totalGeneral(): number {
    return this.ventas.reduce((sum, v) => sum + v.total, 0);
  }
}