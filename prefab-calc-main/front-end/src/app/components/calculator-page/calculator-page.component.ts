import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { MessageService } from 'primeng/api';
import { PrefabitemService } from '../../services/prefabitem.service';
import { PrefabItem } from '../../models/PrefabItem';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { CaminBetonRectComponent } from '../functional/calculator-components/camin-beton-rect/camin-beton-rect.component';
import { CapacCaminBetonRectComponent } from '../functional/calculator-components/capac-camin-beton-rect/capac-camin-beton-rect.component';
import { CaminBetonRotundComponent } from '../functional/calculator-components/camin-beton-rotund/camin-beton-rotund.component';
import { CapacCaminBetonRotundComponent } from '../functional/calculator-components/capac-camin-beton-rotund/capac-camin-beton-rotund.component';
import { SpalierComponent } from '../functional/calculator-components/spalier/spalier.component';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-calculator-page',
  standalone: true,
  imports: [
    DataViewModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    SidebarModule,
    CaminBetonRectComponent,
    CapacCaminBetonRectComponent,
    CaminBetonRotundComponent,
    CapacCaminBetonRotundComponent,
    SpalierComponent,
    ImageModule,
    InputTextModule,
    CardModule,
    ScrollTopModule,
  ],
  providers: [MessageService],
  templateUrl: './calculator-page.component.html',
  styleUrl: './calculator-page.component.scss',
})
export class CalculatorPageComponent implements OnInit {
  prefabItems: PrefabItem[] = [];
  itemLayout: 'list' | 'grid' = 'list';
  sidebarOpen: boolean = false;
  currentPrefab: PrefabItem = { id: -1 };

  constructor(
    private state: StateService,
    private messageService: MessageService,
    private prefabService: PrefabitemService,
  ) {}

  ngOnInit() {
    this.state.activePage = 'calculator';
    this.prefabService.fetchPrefabItems().subscribe((res: any) => {
      for (const item of res) {
        if (this.state.INTERNAL_NAMES.includes(item.internalname)) {
          this.prefabItems.push(item);
        }
      }
    });
  }

  getValueByStock(instock: number): string {
    return instock === 0
      ? 'FĂRĂ STOC'
      : instock === 1
        ? 'ÎN STOC'
        : 'STOC SCĂZUT';
  }

  getSeverityByStock(instock: number): string {
    return instock === 0 ? 'error' : instock === 1 ? 'success' : 'warning';
  }

  loadPrefabItem(item: PrefabItem) {
    this.currentPrefab = item;
    this.sidebarOpen = true;
  }

  getPlaceholderURL(name: any): string {
    let url = 'https://placehold.co/300x300@2x.png?text=';
    let parts = name.match(/[\s\S]{1,6}/g) || [];
    for (const part of parts) {
      url += part;
      url += '\\n';
    }
    return url;
  }
}
