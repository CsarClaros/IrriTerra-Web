import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stock-report',
  // standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './stock-report.html',
  styleUrl: './stock-report.css'
})
export class StockReport {

  productos = [
    { nombre: 'Filtro de Disco Industrial', stock: 5 },
    { nombre: 'Válvula Solenoide 24V', stock: 8 },
    { nombre: 'Controlador Smart WiFi', stock: 12 }
  ];

}