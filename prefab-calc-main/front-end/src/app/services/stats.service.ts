import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  get backendAPI() {
    return this.state.BACKEND_API + 'api/stats';
  }

  constructor(
    private state: StateService,
    private http: HttpClient,
  ) {}

  fetchGeneralStats(): Observable<any> {
    return this.http.get(`${this.backendAPI}/general/`) as Observable<any>;
  }

  fetchProductStats(payload: any): Observable<any> {
    return this.http.post(`${this.backendAPI}/products/`, {
      sales_type: payload.sales_type,
    }) as Observable<any>;
  }
}
