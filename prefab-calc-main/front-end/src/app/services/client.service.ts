import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StateService } from './state.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(
    private http: HttpClient,
    private state: StateService,
  ) {}

  BACKEND_URL = this.state.BACKEND_API + 'api/main/client';

  fetchClients(): Observable<any> {
    return this.http.get(`${this.BACKEND_URL}/`) as Observable<any>;
  }

  addClient(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.BACKEND_URL}/`, payload, {
      headers,
      observe: 'response',
    }) as Observable<any>;
  }

  deleteClient(id: any): Observable<any> {
    return this.http.delete(`${this.BACKEND_URL}/`, {
      body: id,
    }) as Observable<any>;
  }

  editClient(payload: any): Observable<any> {
    return this.http.put(`${this.BACKEND_URL}/`, payload) as Observable<any>;
  }
}
