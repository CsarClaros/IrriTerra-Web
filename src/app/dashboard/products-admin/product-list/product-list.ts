import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User } from 'lucide-angular';
import { ProductCreate } from '../product-create/product-create';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductCreate],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {

  showModal = false;

  User = User;

  productos = [
    {
      id: 1,
      nombre: 'Sistema Goteo Premium',
      categoria: 'Riego por goteo',
      precio: 1200,
      stock: 45,
      estado: 'activo',
      imagen: 'https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c?w=100',
    },
    {
      id: 2,
      nombre: 'Aspersor Giratorio 360°',
      categoria: 'Aspersores',
      precio: 350,
      stock: 78,
      estado: 'activo',
      imagen: 'https://images.unsplash.com/photo-1771684512143-88bdb34782fa?w=100',
    },
    {
      id: 3,
      nombre: 'Controlador Smart WiFi',
      categoria: 'Controladores',
      precio: 800,
      stock: 12,
      estado: 'activo',
      imagen: 'https://images.unsplash.com/photo-1698848065415-ad8e2f269fa8?w=100',
    },
    {
      id: 4,
      nombre: 'Filtro de Disco Industrial',
      categoria: 'Filtros',
      precio: 450,
      stock: 5,
      estado: 'activo',
      imagen: 'https://images.unsplash.com/photo-1698848065415-ad8e2f269fa8?w=100',
    },
    {
      id: 5,
      nombre: 'Válvula Solenoide 24V',
      categoria: 'Válvulas',
      precio: 280,
      stock: 34,
      estado: 'activo',
      imagen: 'https://images.unsplash.com/photo-1698848065415-ad8e2f269fa8?w=100',
    },
  ];

  openCreate() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteProduct(id: number) {
    const confirmDelete = confirm('¿Está seguro de eliminar este producto?');
    if (!confirmDelete) return;

    this.productos = this.productos.filter(p => p.id !== id);
  }

}