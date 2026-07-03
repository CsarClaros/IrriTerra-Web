import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

import { LanguageService } from '../../core/services/language.service';

import {
  STATS,
  SALES_DATA,
  GROWTH_DATA,
  PRODUCT_DATA,
  SELLERS_DATA,
  CHART_COLORS
} from '../data/overview.data';

import {
  DashboardStat,
  SalesData,
  GrowthData,
  ProductData,
  SellerData
} from '../models/dashboard.model';

import { DollarSign, TrendingUp, Package, Users, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-overview',
  // standalone: true,
  imports: [CommonModule, NgxEchartsModule, LucideAngularModule],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class Overview {

  // constructor(private LanguageService: LanguageService) {}

  // ========================
  // i18n helper (equivalente a t())
  // ========================
  t(es: string, en: string) {
    return en; // temporal
  }

  // ========================
  // ICONS (lucide-angular)
  // ========================
  readonly DollarSign = DollarSign;
  readonly TrendingUp = TrendingUp;
  readonly Package = Package;
  readonly Users = Users;

  // ========================
  // DATA
  // ========================
  stats: DashboardStat[] = STATS;
  sellers: SellerData[] = SELLERS_DATA;

  // ========================
  // CHART DATA
  // ========================
  salesData = SALES_DATA;
  growthData = GROWTH_DATA;
  productData = PRODUCT_DATA;
  colors = CHART_COLORS;

  // ========================
  // CHART OPTIONS (ECharts)
  // ========================

  salesChart: EChartsOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: this.salesData.map(d => d.month)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: this.salesData.map(d => d.sales),
        itemStyle: {
          color: '#2E7D32'
        }
      }
    ]
  };

  growthChart: EChartsOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: this.growthData.map(d => d.month)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Growth',
        type: 'line',
        data: this.growthData.map(d => d.growth),
        smooth: true,
        lineStyle: {
          color: '#4FC3F7',
          width: 2
        }
      }
    ]
  };

  productChart: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Products',
        type: 'pie',
        radius: '70%',
        data: this.productData.map((p, i) => ({
          name: p.name,
          value: p.value,
          itemStyle: {
            color: this.colors[i % this.colors.length]
          }
        }))
      }
    ]
  };
}