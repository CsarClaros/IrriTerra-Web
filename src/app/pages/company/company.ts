import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BRANCHES, Branch } from '../../core/data/branches.data';
import { LanguageService } from '../../core/services/language.service';

import {
  LucideAngularModule,
  MapPin
} from 'lucide-angular';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './company.html',
  styleUrl: './company.css',
})
export class Company {

  readonly MapPin = MapPin;

  selectedBranch: string = 'lapaz';
  branches: Branch[] = BRANCHES;

  constructor(private lang: LanguageService) {}

  t(es: string, en: string): string {
    return this.lang.t(es, en);
  }

  get currentBranch(): Branch {
    return this.branches.find(b => b.id === this.selectedBranch) || this.branches[0];
  }

  setBranch(id: string) {
    this.selectedBranch = id;
  }
}