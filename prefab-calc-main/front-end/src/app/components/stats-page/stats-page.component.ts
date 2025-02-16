import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GeneralStatsComponent } from '../functional/stats/general-stats/general-stats.component';
import { SharedModule } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProductStatsComponent } from '../functional/stats/product-stats/product-stats.component';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    GeneralStatsComponent,
    SharedModule,
    TabViewModule,
    ButtonModule,
    RippleModule,
    ProductStatsComponent,
  ],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.scss',
})
export class StatsPageComponent implements OnInit {
  constructor(private statsService: StatsService) {}

  currentStats: any;
  currentStatsType: string = 'general';
  tabIndex: number = 0;

  ngOnInit(): void {
    this.loadGeneral();
  }

  loadGeneral(): void {
    this.statsService.fetchGeneralStats().subscribe((data) => {
      this.currentStats = data;
    });
  }

  loadProducts(): void {
    this.statsService
      .fetchProductStats({ sales_type: '' })
      .subscribe((data) => {
        this.currentStats = data;
      });
  }

  changeStatsType(type: string): void {
    this.currentStatsType = type;
    switch (type) {
      case 'general':
        this.loadGeneral();
        break;
      case 'products':
        this.loadProducts();
        break;
      case 'orders':
        // this.loadOther();
        break;
    }
  }

  switchCategory(event: any): void {
    this.currentStats = null;
    this.tabIndex = event.index;
    switch (this.tabIndex) {
      case 0:
        this.changeStatsType('general');
        break;
      case 1:
        this.changeStatsType('products');
        break;
      case 2:
        this.changeStatsType('orders');
        break;
    }
  }
}
