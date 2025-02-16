import { Component, HostListener, OnInit } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { StateService } from '../../services/state.service';
import { PrefabitemService } from '../../services/prefabitem.service';
import { Category } from '../../models/Category';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { MenubarModule } from 'primeng/menubar';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ScrollTopModule } from 'primeng/scrolltop';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AddPrefabComponent } from '../functional/add-prefab/add-prefab.component';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { catchError } from 'rxjs';
import { TabMenuModule } from 'primeng/tabmenu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    DataViewModule,
    AccordionModule,
    CardModule,
    BadgeModule,
    ButtonModule,
    TagModule,
    MenuModule,
    ImageModule,
    MenubarModule,
    InputNumberModule,
    FormsModule,
    DividerModule,
    ToggleButtonModule,
    ScrollTopModule,
    InputTextModule,
    ToastModule,
    AddPrefabComponent,
    DialogModule,
    RippleModule,
    TabMenuModule,
  ],
  providers: [MessageService],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.currentWindowWidth = event.target.innerWidth;
  }

  get categories(): Category[] {
    return this.state.prefabCategories;
  }

  currentCopy: any[] = [];
  categorizedItems: any[] = [];
  currentItems: any[] = [];
  currentCategory: string | number = 'all';
  currentWindowWidth: number = 0;
  menuItems: MenuItem[] = [
    {
      label: 'Toate',
      command: () => {
        this.setCurrentTo('all');
      },
    },
  ];

  addDialog: boolean = false;

  get saveActive(): boolean {
    return this.state.addPrefabLastStep;
  }

  constructor(
    private state: StateService,
    private prefabItemService: PrefabitemService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.prefabItemService.fetchCategories().subscribe((data) => {
      this.state.prefabCategories = data;
      this.addToMenu();
      this.initCategoryItems();
      this.setCurrentTo('all');
    });

    this.currentWindowWidth = window.innerWidth;
  }

  initCategoryItems(): void {
    this.categorizedItems = [];
    this.categorizedItems.push({ id: 'all', value: [] });
    let filteredItems: any[] = [];
    for (const category of this.categories) {
      filteredItems = [];
      for (const item of category.items) {
        if (!this.state.INTERNAL_NAMES.includes(item.internalname!))
          filteredItems.push(item);
      }
      this.categorizedItems.push({ id: category.id, value: filteredItems });
      this.categorizedItems[0].value.push(...filteredItems);
    }
  }

  refreshItems(): void {
    this.prefabItemService.fetchCategories().subscribe((data) => {
      this.state.prefabCategories = data;
      this.initCategoryItems();
      this.setCurrentTo(this.currentCategory);
    });
  }

  cancelPrefabCreation(): void {
    this.state.thumbnailUploaded = false;
    this.state.addPrefabLastStep = false;
    this.addDialog = false;
  }

  onPrefabSave(): void {
    let computedPrice = 0;

    switch (this.state.addPrefabThirdOption) {
      case 'default':
        computedPrice = 0;
        break;
      case 'camin_rect':
        computedPrice = parseFloat(this.state.caminBetonRectTotalCost);
        break;
      case 'capac_camin_rect':
        computedPrice = parseFloat(this.state.capacCaminBetonRectTotalCost);
        break;
      case 'camin_rotund':
        computedPrice = parseFloat(this.state.caminBetonRotundTotalCost);
        break;
      case 'capac_camin_rotund':
        computedPrice = parseFloat(this.state.capacCaminBetonRotundTotalCost);
        break;
      case 'spalier':
        computedPrice = parseFloat(this.state.spalierTotalCost);
        break;
      default:
        break;
    }

    const newItem = {
      name: this.state.newItemName,
      description: this.state.newItemDescription,
      stock: this.state.newItemStock,
      cost: computedPrice,
      price: this.state.newItemPrice,
      thumbnail: this.state.newItemThumbnail,
      internalname: this.state.newItemName.replaceAll(' ', '_').toLowerCase(),
      category: this.state.newItemCategory,
      product_code: this.state.newItemProductCode,
      dimensions: JSON.stringify(this.state.currentPrefabDimensions),
    };

    this.prefabItemService
      .addPrefabItem(newItem)
      .pipe(
        catchError((error: any): any => {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail: 'Eroare la adăguarea produsului',
          });
          return error;
        }),
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Produs adăguat cu succes',
        });
        this.refreshItems();
      });

    this.state.addPrefabLastStep = false;
    this.addDialog = false;
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

  addToMenu(): void {
    this.menuItems = [
      {
        label: 'Toate',
        command: () => {
          this.setCurrentTo('all');
        },
      },
    ];
    this.categories.forEach((category) => {
      // @ts-ignore
      this.menuItems.push({
        label: category.name,
        command: () => {
          this.setCurrentTo(category.id);
        },
      });
    });

    // refresh menu
    this.menuItems = [...this.menuItems];
  }

  setCurrentTo(category: string | number): void {
    this.currentItems = this.categorizedItems.find(
      (item) => item.id === category,
    ).value;
    this.currentCopy = structuredClone(this.currentItems);
    this.currentCategory = category;
  }

  getCurrentCategoryName(): string {
    return this.currentCategory === 'all'
      ? 'Toate'
      : this.categories.find((category) => category.id === this.currentCategory)
          ?.name || 'Toate';
  }

  addToCart(prefabItem: any) {
    prefabItem.discount = 0;
    if (!this.state.currentOrder.items) {
      this.state.currentOrder.items = [];
    }

    for (const item of this.state.currentOrder.items) {
      if (item.id === prefabItem.id) {
        item.quantity += prefabItem.quantity;
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Produs adăugat la comandă.',
        });
        return;
      }
    }

    this.state.currentOrder.items.push(prefabItem);
    localStorage.setItem(
      'currentOrder',
      JSON.stringify(this.state.currentOrder),
    );
  }

  openAddPrefab() {
    this.state.isCategorySet = true;
    this.addDialog = true;
    const itemCategory = this.categories.find(
      (category) => category.id === this.currentCategory,
    );
    this.state.newItemCategory = itemCategory!.name;
  }

  getPlaceholderURL(name: any) {
    let url = 'https://placehold.co/300x300@2x.png?text=';
    let parts = name.match(/[\s\S]{1,6}/g) || [];
    for (const part of parts) {
      url += part;
      url += '\\n';
    }
    return url;
  }

  filterBy($event: any) {
    const value = $event.target.value;
    if (value === '') {
      this.setCurrentTo(this.currentCategory);
    } else {
      let tmp = [];
      for (const item of this.currentCopy) {
        try {
          if (item.name.includes(value) || item.product_code.includes(value)) {
            tmp.push(item);
          }
        } catch (error: any) {
          console.log(item);
        }
      }
      this.currentItems = tmp;
    }
  }

  openSingleProductPage(item: any) {
    this.state.singleProduct = item;
    localStorage.setItem('currentProduct', JSON.stringify(item));
    this.router.navigate(['/product']);
  }
}
