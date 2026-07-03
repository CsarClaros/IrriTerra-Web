import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  // standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css'
})
export class ProductCreate {

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

  save() {
    console.log('Producto creado:', this.formData);
    alert('Producto creado correctamente');

    // reset
    this.formData = {
      nombre: '',
      categoria: '',
      precio: 0,
      stock: 0,
      imagen: ''
    };
  }

}