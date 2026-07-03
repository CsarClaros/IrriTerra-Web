import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LucideAngularModule, Search, Filter } from 'lucide-angular';

import { ImageWithFallback } from '../../shared/components/image-with-fallback/image-with-fallback';
import { LanguageService } from '../../core/services/language.service';

import {
  PRODUCTS,
  PRODUCT_CATEGORIES
} from '../../core/data/products.data';

import {
  Product,
  ProductCategory
} from '../../shared/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ImageWithFallback
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {

  readonly Search = Search;
  readonly Filter = Filter;

  categories: ProductCategory[] = PRODUCT_CATEGORIES;

  products: Product[] = PRODUCTS;

  selectedCategory = 'all';

  searchText = '';

  onlyInStock = true;

  constructor(
    public languageService: LanguageService
  ) {}

  t(es: string, en: string): string {
    return this.languageService.t(es, en);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  get filteredProducts(): Product[] {

    return this.products.filter(product => {

      const categoryMatch =
        this.selectedCategory === 'all' ||
        product.category === this.selectedCategory;

      const stockMatch =
        !this.onlyInStock || product.inStock;

      const search = this.searchText.trim().toLowerCase();

      const searchMatch =
        search === '' ||
        product.name.es.toLowerCase().includes(search) ||
        product.name.en.toLowerCase().includes(search) ||
        product.description.es.toLowerCase().includes(search) ||
        product.description.en.toLowerCase().includes(search);

      return categoryMatch && stockMatch && searchMatch;

    });

  }

}