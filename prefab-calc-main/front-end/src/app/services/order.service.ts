import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private httpClient: HttpClient,
    private state: StateService,
  ) {}

  BACKEND_URL = this.state.BACKEND_API + 'api/main/order';

  fetchOrders(): any {
    return this.httpClient.get(`${this.BACKEND_URL}/`);
  }

  createOrder(order: any): any {
    return this.httpClient.post(`${this.BACKEND_URL}/`, order);
  }

  updateOrder(order: any): any {
    return this.httpClient.put(`${this.BACKEND_URL}/`, order);
  }

  updateOrderStatus(order: any): any {
    return this.httpClient.post(`${this.BACKEND_URL}-status/`, {
      id: order.id,
      status: order.status,
    });
  }

  fetchOrderById(id: any): any {
    return this.httpClient.post(`${this.BACKEND_URL}-by-id/`, { id });
  }

  deleteOrder(id: any): any {
    return this.httpClient.delete(`${this.BACKEND_URL}/`, { body: { id } });
  }

  exportOrder(id: any): any {
    return this.httpClient.post(
      `${this.state.BACKEND_API}api/main/export-order/`,
      { id },
    );
  }
}
