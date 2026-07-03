import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css'
})
export class ProductEdit {

  id!: number;

  formData = {
    nombre: '',
    categoria: '',
    precio: 0,
    stock: 0,
    imagen: ''
  };

  categorias = [
    'Riego por goteo',
    'Aspersores',
    'Controladores',
    'Filtros',
    'Válvulas'
  ];

  // MOCK DATA (luego lo conectas a service)
  productos = [
    {
      id: 1,
      nombre: 'Sistema Goteo Premium',
      categoria: 'Riego por goteo',
      precio: 1200,
      stock: 45,
      imagen: 'https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c?w=100',
    },
    {
      id: 2,
      nombre: 'Aspersor Giratorio 360°',
      categoria: 'Aspersores',
      precio: 350,
      stock: 78,
      imagen: 'https://images.unsplash.com/photo-1771684512143-88bdb34782fa?w=100',
    }
  ];

  constructor(private route: ActivatedRoute) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    const producto = this.productos.find(p => p.id === this.id);

    if (producto) {
      this.formData = { ...producto };
    }
  }

  update() {
    console.log('Producto actualizado:', this.formData);
    alert('Producto actualizado correctamente');
  }

}