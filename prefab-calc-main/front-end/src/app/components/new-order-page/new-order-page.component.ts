import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { catchError } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AddClientFormComponent } from '../functional/add-client-form/add-client-form.component';
import { DialogModule } from 'primeng/dialog';
import { Client } from '../../models/Client';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { SpinnerModule } from 'primeng/spinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { PrefabitemService } from '../../services/prefabitem.service';
import { CalendarModule } from 'primeng/calendar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { NgIf } from '@angular/common';
import { AddPrefabComponent } from '../functional/add-prefab/add-prefab.component';
import { PrefabItem } from '../../models/PrefabItem';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

// TODO: Add user_id and username to the order object before sending order

@Component({
  selector: 'app-new-order-page',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    RippleModule,
    DividerModule,
    DropdownModule,
    FormsModule,
    AddClientFormComponent,
    DialogModule,
    ToastModule,
    TableModule,
    ImageModule,
    SpinnerModule,
    InputNumberModule,
    ConfirmDialogModule,
    CheckboxModule,
    CalendarModule,
    ScrollPanelModule,
    ConfirmPopupModule,
    NgIf,
    AddPrefabComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './new-order-page.component.html',
  styleUrl: './new-order-page.component.scss',
})
export class NewOrderPageComponent implements OnInit, OnDestroy {
  constructor(
    private state: StateService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private clientService: ClientService,
    private breakpointObserver: BreakpointObserver,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private prefabItemService: PrefabitemService,
  ) {
    this.breakpointObserver
      .observe(['(max-width: 991.9px)'])
      .subscribe((result: BreakpointState) => {
        if (result.matches) {
          this.dividerLayout = 'horizontal';
        } else {
          this.dividerLayout = 'vertical';
        }
      });
  }

  displayAddClientDialog: boolean = false;
  displayNewPrefabDialog: boolean = false;
  displayAddPrefabDialog: boolean = false;

  prefabList: PrefabItem[] = [];

  get newClient(): Client {
    return this.state.newClient;
  }

  set newClient(value: Client) {
    this.state.newClient = value;
  }

  get addClientForm() {
    return this.state.addClientForm;
  }

  get currentOrder(): any {
    return this.state.currentOrder;
  }

  set currentOrder(value) {
    this.state.currentOrder = value;
  }

  dividerLayout: 'horizontal' | 'vertical' = 'vertical';
  clients: any[] = [];

  get selectedClient() {
    return this.state.currentOrderClient;
  }

  set selectedClient(value) {
    this.state.currentOrderClient = value;
    this.currentOrder.client_id = this.selectedClient.id;
  }

  ngOnInit(): void {
    this.state.activePage = 'new-order';
    this.initClientList();
    this.updateOrderIfPriceChanged();
    this.initPrefabList();
  }

  ngOnDestroy() {
    this.updateOrderLocalStorage();
  }

  initPrefabList(): void {
    this.prefabItemService.fetchPrefabItems().subscribe((data) => {
      this.prefabList = data.filter(
        (item: any) => !this.state.INTERNAL_NAMES.includes(item.internalname),
      );
    });
  }

  orderHasItem(item: PrefabItem): boolean {
    return this.currentOrder.items.some((i: any) => i.id === item.id);
  }

  updateOrderIfPriceChanged(forceUpdate: boolean = false) {
    if (this.state.isCurrentOrderEditMode && !forceUpdate) {
      this.orderService
        .fetchOrderById(this.state.currentOrder.id)
        .subscribe((response: any) => {
          this.state.currentOrder = response;
          this.selectedClient = this.clients.find(
            (client) => client.id === this.state.currentOrder.client_id,
          );
        });
      return;
    }
    this.prefabItemService.fetchPrefabItems().subscribe((data) => {
      if (this.currentOrder.items) {
        for (let i = 0; i < this.currentOrder.items.length; i++) {
          const item = data.find(
            (element: any) => element.id === this.currentOrder.items[i].id,
          );
          if (item.price !== this.currentOrder.items[i].price) {
            this.currentOrder.items[i].price = item.price;
            this.currentOrder.items[i].total = this.computeProductTotal(
              item.price,
              this.currentOrder.items[i].quantity,
              this.currentOrder.items[i].discount,
            );
          }
        }
      }
      this.computeOrderTotal();
    });
  }

  initClientList() {
    this.clientService
      .fetchClients()
      .pipe(
        catchError((error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail: 'Eroare la încărcarea clienților.',
          });
          return [];
        }),
      )
      .subscribe((result) => {
        this.clients = result;
      });
  }

  resetForm() {
    this.addClientForm!.reset();
  }

  addClient() {
    if (this.addClientForm!.valid) {
      this.newClient = this.addClientForm!.value;
      this.clientService
        .addClient(this.newClient)
        .pipe(
          catchError((error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Eroare',
              detail: error.error.detail,
            });
            return [];
          }),
        )
        .subscribe((response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client adăugat cu succes',
          });
          this.initClientList();
          this.displayAddClientDialog = false;
        });
    }
  }

  sendOrder() {
    if (this.currentOrder.items.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Eroare',
        detail: 'Comanda nu conține produse.',
      });
      return;
    }

    const payload = {
      user_id: this.authService.getCurrentUserId(),
      ...this.currentOrder,
    };

    if (this.state.isCurrentOrderEditMode) {
      this.orderService
        .updateOrder(payload)
        .pipe(
          catchError((error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Eroare',
              detail: 'Eroare la trimiterea comenzii.',
            });
            return [];
          }),
        )
        .subscribe((response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Comandă trimisă',
            detail: 'Comanda a fost trimisă cu succes.',
          });
          this.state.isCurrentOrderEditMode = false;
          this.state.currentOrder = {
            items: [],
            total: 0.0,
            status: 'Așteptare',
            address: '',
            subtotal: 0.0,
            shipping: 0.0,
            discount: 0.0,
          };
          this.selectedClient = {
            id: undefined,
          };
          localStorage.removeItem('currentOrder');
          this.router.navigate(['/orders']);
        });
      return;
    }

    this.orderService
      .createOrder(payload)
      .pipe(
        catchError((error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Eroare',
            detail: 'Eroare la trimiterea comenzii.',
          });
          return [];
        }),
      )
      .subscribe((response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Comandă trimisă',
          detail: 'Comanda a fost trimisă cu succes.',
        });
        this.state.currentOrder = {
          items: [],
          total: 0.0,
          status: 'Așteptare',
          address: '',
          subtotal: 0.0,
          shipping: 0.0,
          discount: 0.0,
        };
        this.selectedClient = {
          id: undefined,
        };
        localStorage.removeItem('currentOrder');
        this.router.navigate(['/orders']);
      });
  }

  removeItem(item: any) {
    this.confirmationService.confirm({
      message: 'Ești sigur că vrei să ștergi acest produs din comandă?',
      accept: () => {
        this.state.currentOrder.items = this.state.currentOrder.items!.filter(
          (i: any) => i !== item,
        );
        this.computeOrderTotal();

        this.updateOrderLocalStorage();
      },
    });
  }

  computeProductTotal(
    price: any,
    quantity: any,
    discount: any,
    refreshTotal: boolean = true,
  ) {
    let total = price * quantity;
    total *= 1 - discount / 100;
    this.updateOrderLocalStorage();

    if (refreshTotal) this.computeOrderTotal();

    return total.toFixed(2);
  }

  updateOrderLocalStorage() {
    localStorage.setItem(
      'currentOrder',
      JSON.stringify(this.state.currentOrder),
    );
  }

  cancelCurrentOrder(): void {
    if (this.state.currentOrder.items!.length === 0) {
      return;
    }

    this.confirmationService.confirm({
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Da',
      rejectLabel: 'Nu',
      header: 'Renunțare la comandă',
      message:
        'Ești sigur că vrei să anulezi comanda curentă?|Toate datele vor fi pierdute.',
      accept: () => {
        this.state.currentOrder = {
          items: [],
          total: 0.0,
          status: 'Așteptare',
          address: '',
          subtotal: 0.0,
          shipping: 0.0,
          discount: 0.0,
        };
        this.selectedClient = {
          id: undefined,
        };
        this.state.isCurrentOrderEditMode = false;
        localStorage.removeItem('currentOrder');
      },
    });
  }

  computeOrderTotal() {
    let total: any = this.currentOrder.shipping || 0;
    let subtotal = 0;
    let itemTotal = 0;
    let itemDiscounted = 0;

    for (const item of this.currentOrder.items) {
      itemTotal = item.price * item.quantity;
      if (item.discount >= 0) {
        itemDiscounted = itemTotal - itemTotal * (item.discount / 100);
      } else {
        itemDiscounted = itemTotal;
      }

      subtotal += itemDiscounted;

      if (item.globalDiscount === true) {
        itemDiscounted =
          itemDiscounted - itemDiscounted * (this.currentOrder.discount / 100);
        total += itemDiscounted;
      } else {
        total += itemDiscounted;
      }
    }

    this.currentOrder.subtotal = subtotal.toFixed(2);
    this.currentOrder.total = total.toFixed(2);
  }

  getDiscount() {
    if (this.currentOrder.discount) {
      return `${(this.currentOrder.total - this.currentOrder.subtotal - this.currentOrder.shipping).toFixed(2)}`;
    }

    return '0';
  }

  getShipping() {
    if (this.currentOrder.shipping) {
      return `+${this.currentOrder.shipping}`;
    }

    return '0';
  }

  clientSelected() {
    if (this.selectedClient) {
      if (this.selectedClient.id) {
        return true;
      }
    }
    return false;
  }

  isButtonDisabled() {
    if (this.currentOrder.items.length === 0) {
      return true;
    }
    if (this.currentOrder) {
      if (!this.currentOrder.due_date) {
        return true;
      }
    }
    if (this.selectedClient) {
      if (!this.selectedClient.id) {
        return true;
      }
    }

    return false;
  }

  openNewPrefabDialog(): void {
    this.displayAddPrefabDialog = false;
    this.displayNewPrefabDialog = true;
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
      })
      .add(() => {
        this.state.addPrefabLastStep = false;
        this.displayNewPrefabDialog = false;
        this.displayAddPrefabDialog = true;
        this.initPrefabList();
      });
  }

  filterTable($event: Event, dt: Table) {
    dt.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  addItem(prefab: PrefabItem) {
    const itemToPush: any = prefab;
    itemToPush.quantity = 1;
    itemToPush.discount = 0;
    itemToPush.globalDiscount = false;
    itemToPush.total = prefab.price;

    this.currentOrder.items.push(itemToPush);

    this.computeOrderTotal();
    this.updateOrderLocalStorage();
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
}
