import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { PrefabitemService } from '../../services/prefabitem.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/Order';
import { Router, RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { catchError } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    RouterLink,
    AccordionModule,
    CardModule,
    TagModule,
    DividerModule,
    TableModule,
    ImageModule,
    ConfirmDialogModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    NgClass,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss',
})
export class OrderPageComponent implements OnInit {
  constructor(
    private state: StateService,
    private prefabService: PrefabitemService,
    private orderService: OrderService,
    private messageService: MessageService,
    private breakpointObserver: BreakpointObserver,
    private confirmationService: ConfirmationService,
    private router: Router,
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

  statusOptions: any[] = [
    { label: 'Anulată', value: 'Anulată' },
    { label: 'Finalizată', value: 'Finalizată' },
  ];
  selectedStatus: any = null;
  displayChangeStatusDialog: boolean = false;
  selectedOrder: any = null;
  orders: any[] = [];
  addOrderVisible: boolean = true;
  dividerLayout: 'horizontal' | 'vertical' | undefined = 'vertical';

  ngOnInit(): void {
    this.state.activePage = 'orders';
    this.initializeOrders();
  }

  initializeOrders(): void {
    this.orderService.fetchOrders().subscribe((orders: any) => {
      this.orders = orders;
    });
  }

  getSeverityByStatus(status: string): string {
    switch (status) {
      case 'Anulată':
        return 'danger';
      case 'În stoc':
        return 'info';
      case 'Stoc insuficient':
        return 'warning';
      case 'Finalizată':
        return 'success';
      default:
        return 'info';
    }
  }

  getItemTotal(item: any, order: any): string {
    const price = item.price;
    const qty = item.quantity;
    const discount = item.discount;
    const globalDiscount = order.discount;
    const isGlobalDiscount = item.global_discount;

    let total = price * qty;
    if (discount) {
      total *= 1 - discount / 100;
    }

    if (isGlobalDiscount) {
      total *= 1 - globalDiscount / 100;
    }

    return total.toFixed(2);
  }

  getDiscountSum(order: any): string {
    let sum = 0;
    for (let item of order.items) {
      if (item.globalDiscount) {
        sum += (item.price * item.quantity * order.discount) / 100;
      }
    }

    return sum.toFixed(2) + ' lei';
  }

  editOrder(order: any): void {
    if (this.state.currentOrder.items!.length > 0) {
      if ('id' in this.state.currentOrder)
        if (this.state.currentOrder.id === order.id) {
          this.state.isCurrentOrderEditMode = true;
          this.state.currentOrder = order;
          this.state.activePage = 'new-order';
          this.router.navigate(['/new-order']);
          return;
        }
      this.confirmationService.confirm({
        message:
          'Aveți o comandă în curs. Editarea comenzii selectate va anula comanda în curs.|Salvați comanda în curs înainte de a continua?',
        header: 'Comandă în curs',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.orderService
            .createOrder(this.state.currentOrder)
            .subscribe(() => {
              this.state.currentOrder = order;
              this.state.isCurrentOrderEditMode = true;
              this.state.activePage = 'new-order';
            });
        },
        reject: () => {
          this.state.currentOrder = order;
          this.state.isCurrentOrderEditMode = true;
          this.state.activePage = 'new-order';
        },
      });
    }

    this.state.currentOrder = order;
    this.state.activePage = 'new-order';
  }

  changeStatus(order: any): void {
    this.selectedOrder = order;
    this.selectedStatus = this.statusOptions.find((status) => {
      return status.label === order.status;
    });
    this.displayChangeStatusDialog = true;
  }

  changeOrderStatus() {
    this.selectedOrder.status = this.selectedStatus.value;
    this.orderService
      .updateOrderStatus(this.selectedOrder)
      .pipe(
        catchError((error: any) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: error.error.detail,
          });
          this.initializeOrders();
          return error;
        }),
      )
      .subscribe(() => {
        this.initializeOrders();
      });
    this.displayChangeStatusDialog = false;
  }

  exportOrder(order: any) {
    this.orderService.exportOrder(order.id).subscribe((response: any) => {});
  }

  deleteOrder(order: any) {
    this.confirmationService.confirm({
      message: 'Sunteți sigur că doriți să ștergeți această comandă?',
      header: 'Confirmare ștergere',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService.deleteOrder(order.id).subscribe(() => {
          this.initializeOrders();
        });
      },
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
}
