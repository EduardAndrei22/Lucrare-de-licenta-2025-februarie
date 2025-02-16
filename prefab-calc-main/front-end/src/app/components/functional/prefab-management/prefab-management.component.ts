import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StateService } from '../../../services/state.service';
import { PrefabitemService } from '../../../services/prefabitem.service';
import { PrefabItem } from '../../../models/PrefabItem';
import { catchError } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { StepperModule } from 'primeng/stepper';
import { Category } from '../../../models/Category';
import { InputNumberModule } from 'primeng/inputnumber';
import { AddPrefabComponent } from '../add-prefab/add-prefab.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  ToggleButtonChangeEvent,
  ToggleButtonModule,
} from 'primeng/togglebutton';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-prefab-management',
  standalone: true,
  imports: [
    ToastModule,
    TableModule,
    InputTextModule,
    FormsModule,
    RippleModule,
    NgIf,
    ButtonModule,
    DialogModule,
    InputTextareaModule,
    ToolbarModule,
    CardModule,
    TagModule,
    DropdownModule,
    DividerModule,
    StepperModule,
    InputNumberModule,
    AddPrefabComponent,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    ConfirmDialogModule,
    ToggleButtonModule,
    ImageModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './prefab-management.component.html',
  styleUrl: './prefab-management.component.scss',
})
export class PrefabManagementComponent implements OnInit {
  prefabItems: PrefabItem[] = [];
  clonedItems: { [s: string]: PrefabItem } = {};
  statuses: any[] = [
    { label: 'Fără stoc', value: 0 },
    { label: 'În stoc', value: 1 },
    { label: 'Stoc scăzut', value: 2 },
  ];
  categories: any[] = [];

  get defaultItems(): string[] {
    return this.state.INTERNAL_NAMES;
  }

  editModeEnabled: boolean | undefined = false;
  addDialog: boolean = false;
  cols: any[] = [];
  _selectedColumns: any[] = [];

  constructor(
    private messageService: MessageService,
    private state: StateService,
    private prefabItemService: PrefabitemService,
    private confirmationService: ConfirmationService,
  ) {}

  get saveActive(): boolean {
    return this.state.addPrefabLastStep;
  }

  ngOnInit(): void {
    this.fetchItems();
    this.initCols();

    this.prefabItemService
      .fetchCategories()
      .pipe(
        catchError((error: any): any => {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail: 'Eroare la preluarea categoriilor.',
          });
          return error;
        }),
      )
      .subscribe((categories: any[]) => {
        for (const category of categories) {
          this.categories.push({ label: category.name, value: category.id });
        }
      });
  }

  initCols(): void {
    this.cols = [
      { field: 'product_code', header: 'Cod Produs' },
      { field: 'name', header: 'Nume' },
      { field: 'description', header: 'Descriere' },
      { field: 'instock', header: 'Status' },
      { field: 'stock', header: 'Stoc' },
      { field: 'price', header: 'Preț' },
      { field: 'category', header: 'Categorie' },
    ];

    this._selectedColumns = this.cols;
  }

  get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  fetchItems(): void {
    this.prefabItemService
      .fetchPrefabItems()
      .pipe(
        catchError((error: any): any => {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail: 'Eroare la preluarea produselor',
          });
          return error;
        }),
      )
      .subscribe((prefabItems: PrefabItem[]) => {
        this.prefabItems = prefabItems.filter(
          (item) => !this.state.INTERNAL_NAMES.includes(item.internalname!),
        );
      });
  }

  onRowEdit(item: PrefabItem) {
    this.clonedItems[item.id] = { ...item };
  }

  onRowEditCancel(item: PrefabItem, index: number) {
    this.prefabItems[index] = this.clonedItems[item.id];
    delete this.clonedItems[item.id];
  }

  onRowEditSave(item: PrefabItem) {
    this.prefabItemService
      .updatePrefabItem(item)
      .pipe(
        catchError((error: any): any => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update prefab item',
          });
          this.fetchItems();
          return error;
        }),
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Produs actualizat',
        });
        this.fetchItems();
      });
    delete this.clonedItems[item.id];
  }

  getValueByStock(instock: number) {
    return instock === 0
      ? 'FĂRĂ STOC'
      : instock === 1
        ? 'ÎN STOC'
        : 'STOC SCĂZUT';
  }

  getSeverityByStock(instock: number) {
    return instock === 0 ? 'error' : instock === 1 ? 'success' : 'warning';
  }

  onPrefabAdd(): void {
    this.addDialog = true;
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
        this.ngOnInit();
      });

    this.state.addPrefabLastStep = false;
    this.addDialog = false;
  }

  cancelPrefabCreation(): void {
    this.state.thumbnailUploaded = false;
    this.state.addPrefabLastStep = false;
    this.addDialog = false;
  }

  filterTable($event: Event, dt: Table) {
    dt.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  onRowDelete(prefabItem: any, $event: any) {
    this.confirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Vrei să ștergi acest produs?',
      header: 'Confirmare ștergere produs',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Da',
      rejectLabel: 'Nu',

      accept: () => {
        this.prefabItemService
          .deletePrefabItem(prefabItem.internalname)
          .pipe(
            catchError((error: any): any => {
              this.messageService.add({
                severity: 'error',
                summary: 'Eroare',
                detail: error.error.detail,
              });
              return error;
            }),
          )
          .subscribe(() => {
            this.fetchItems();
            this.messageService.add({
              severity: 'success',
              summary: 'Șters',
              detail: 'Produs șters cu succes',
            });
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Anulat',
          detail: 'Nu a fost făcută nicio schimbare',
        });
      },
    });
  }

  toggleEditMode($event: ToggleButtonChangeEvent) {
    this.editModeEnabled = $event.checked;
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
