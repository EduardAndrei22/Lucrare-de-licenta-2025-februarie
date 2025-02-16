import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrefabitemService {
  get backendAPI() {
    return this.state.BACKEND_API;
  }

  constructor(
    private state: StateService,
    private http: HttpClient,
  ) {}

  fetchPrefabItems(): Observable<any> {
    return this.http.get(
      `${this.backendAPI}api/main/prefabitem/`,
    ) as Observable<any>;
  }

  addPrefabItem(data: any): Observable<any> {
    return this.http.post(
      `${this.backendAPI}api/main/prefabitem/`,
      data,
    ) as Observable<any>;
  }

  updatePrefabItem(data: any): Observable<any> {
    console.log(data);
    return this.http.put(
      `${this.backendAPI}api/main/prefabitem/`,
      data,
    ) as Observable<any>;
  }

  deletePrefabItem(payload: string): Observable<any> {
    return this.http.delete(`${this.backendAPI}api/main/prefabitem/`, {
      body: { internalname: payload },
    }) as Observable<any>;
  }

  fetchCategories(): Observable<any> {
    return this.http.get(
      `${this.backendAPI}api/main/category/`,
    ) as Observable<any>;
  }

  addCategory(data: any): Observable<any> {
    return this.http.post(
      `${this.backendAPI}api/main/category/`,
      data,
    ) as Observable<any>;
  }

  updateCategory(data: any): Observable<any> {
    return this.http.put(
      `${this.backendAPI}api/main/category/`,
      data,
    ) as Observable<any>;
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(
      `${this.backendAPI}api/main/category/${id}/`,
    ) as Observable<any>;
  }

  fetchCategorizedItems(): Observable<any> {
    return this.http.get(
      `${this.backendAPI}api/main/prefab-by-category/`,
    ) as Observable<any>;
  }

  ensureCategories(): Observable<any> {
    return this.http.get(
      `${this.backendAPI}api/main/ensure-categories/`,
    ) as Observable<any>;
  }

  fetchItemStockHistory(internalname: string): Observable<any> {
    return this.http.post(`${this.backendAPI}api/main/get-stock-history/`, {
      internalname,
    }) as Observable<any>;
  }

  addItemStockHistory(data: any): Observable<any> {
    return this.http.post(
      `${this.backendAPI}api/main/add-stock-history/`,
      data,
    ) as Observable<any>;
  }
}
