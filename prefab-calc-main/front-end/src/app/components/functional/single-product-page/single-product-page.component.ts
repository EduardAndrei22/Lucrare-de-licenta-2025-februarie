import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { StateService } from '../../../services/state.service';
import { ImageModule } from 'primeng/image';
import { PrefabItem } from '../../../models/PrefabItem';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PrefabitemService } from '../../../services/prefabitem.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { catchError } from 'rxjs';
import { NgClass } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-single-product-page',
  standalone: true,
  imports: [
    ImageModule,
    DividerModule,
    TooltipModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumberModule,
    NgClass,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './single-product-page.component.html',
  styleUrl: './single-product-page.component.scss',
})
export class SingleProductPageComponent implements OnInit, OnDestroy {
  @ViewChild('historyDiv') private scrollElement: ElementRef | undefined;

  constructor(
    private state: StateService,
    private messageService: MessageService,
    private prefabitemService: PrefabitemService,
    private confirmationService: ConfirmationService,
  ) {}

  translations: any = {
    armature: 'Armare',
    length: 'Lungime',
    width: 'Lățime',
    height: 'Înălțime',
    thickness: 'Grosime',
    withValve: 'Cămin de vane',
    pvcPipeNumber: 'Număr țevi PVC',
    labor: 'Manoperă',
    materialNeeded: 'Necesar material',
    volume: 'Volum',
    diameter: 'Diametru',
    resistanceOption: 'Rezistență',
    dimensionOption: 'Dimensiune secțiune',
  };

  get item() {
    return this.state.singleProduct!;
  }

  set item(value: PrefabItem | null) {
    this.state.singleProduct = value;
  }

  itemDimensions: any = null;
  stockHistory: any = [];
  stockChange: number = 0;
  stockReason: string = '';
  historyDiv: any = null;
  scrollInterval: any = null;

  ngOnDestroy() {
    clearInterval(this.scrollInterval);
  }

  ngOnInit(): void {
    if (this.item === null) {
      this.item = JSON.parse(localStorage.getItem('currentProduct')!)!;
    }
    this.prefabitemService
      .fetchPrefabItems()
      .subscribe((items: any) => {
        for (const item of items) {
          if (item.internalname === this.item?.internalname) {
            this.item = item;
            break;
          }
        }
      })
      .add(() => {
        localStorage.setItem('currentProduct', JSON.stringify(this.item));
        this.getItemCategory();
        this.computeItemDimensions();
        this.getItemStockHistory();
      });
  }

  getItemStockHistory() {
    this.prefabitemService
      .fetchItemStockHistory(this.item!.internalname!)
      .subscribe((stockHistory: any) => {
        this.stockHistory = stockHistory;
      });
  }

  getItemCategory() {
    this.prefabitemService.fetchCategories().subscribe((categories: any) => {
      for (const category of categories) {
        for (const item of category.items) {
          if (item.id === this.item?.id) {
            this.item!.category = category.name;
            return;
          }
        }
      }
    });
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

  copyToClipboard(value: any) {
    navigator.clipboard.writeText(value);
    this.messageService.add({
      severity: 'success',
      summary: 'Copiat',
      detail: 'Textul a fost copiat cu succes',
    });
  }

  computeItemDimensions() {
    if (!this.item?.dimensions || this.item.dimensions.length < 2) return;
    this.itemDimensions = [];
    const dimensions = JSON.parse(this.item.dimensions);
    let name: any = '';
    let value: any = null;
    for (const item of Object.keys(dimensions)) {
      name = this.translations[item];

      switch (item) {
        case 'labor':
          value = dimensions[item] + ' ore';
          break;
        case 'materialNeeded':
          value = dimensions[item] + ' kg';
          break;
        case 'dimensionOption':
          value = dimensions[item][name];
          break;
        case 'armature':
          value = dimensions[item][name];
          break;
        case 'length':
          value = dimensions[item] + ' m';
          break;
        case 'width':
          value = dimensions[item] + ' m';
          break;
        case 'height':
          value = dimensions[item] + ' m';
          break;
        case 'thickness':
          value = dimensions[item] + ' m';
          break;
        case 'volume':
          value = dimensions[item].toFixed(2) + ' m³';
          break;
        case 'diameter':
          value = dimensions[item] + ' m';
          break;
        case 'resistanceOption':
          value = dimensions[item][name];
          break;
        case 'withValve':
          value = dimensions[item] ? 'Da' : 'Nu';
          break;
        case 'pvcPipeNumber':
          value = dimensions[item];
          break;
        default:
          value = dimensions[item];
      }

      if (item === 'materialNeeded' && parseInt(dimensions[item]) === 0)
        continue;
      if (
        name === null ||
        value === null ||
        name == undefined ||
        value == undefined ||
        name === '' ||
        value === ''
      )
        continue;

      this.itemDimensions.push({ name: name, value: value });
    }
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

  changeStock() {
    console.log(this.stockChange);
    console.log(this.item!.stock);
    const internalname = this.item!.internalname!;
    const stock = this.item!.stock! + this.stockChange;
    console.log(stock);
    const reason = this.stockReason;
    const type = this.stockChange > 0 ? '+' : '-';
    const quantity = this.stockChange;

    this.prefabitemService
      .addItemStockHistory({ internalname, stock, reason, type, quantity })
      .pipe(
        catchError((error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail: error.error.detail,
          });
          return error;
        }),
      )
      .subscribe(() => {
        this.item!.stock = stock;
        this.getItemStockHistory();
        this.messageService.add({
          severity: 'success',
          summary: 'Succes',
          detail: 'Stocul a fost actualizat cu succes.',
        });
      });

    this.stockChange = 0;
    this.stockReason = '';
    this.getItemStockHistory();
  }

  selectCurrent($event: Event) {
    // @ts-ignore
    $event.target!.select();
  }

  navigateBack() {
    window.history.back();
  }

  isLastEntry(entry: any): boolean {
    return this.stockHistory.indexOf(entry) === this.stockHistory.length - 1;
  }

  deleteCurrentProduct($event: any): void {
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
        this.prefabitemService
          .deletePrefabItem(this.item!.internalname!)
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
            this.messageService.add({
              severity: 'success',
              summary: 'Șters',
              detail: 'Produs șters cu succes',
            });
            this.navigateBack();
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
}
