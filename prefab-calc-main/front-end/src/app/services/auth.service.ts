import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private state: StateService,
  ) {}

  BACKEND_URL = this.state.BACKEND_API + 'api/auth';

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenPayload.exp * 1000);
    const now = new Date();
    return expirationDate > now;
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify({ username, password });
    return this.httpClient.post(`${this.BACKEND_URL}/token/`, body, {
      headers,
      observe: 'response',
    }) as Observable<any>;
  }

  refreshToken() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const refreshToken = localStorage.getItem('refresh_token') as string;
    return this.httpClient
      .post(
        `${this.BACKEND_URL}/token/refresh/`,
        {
          refresh: refreshToken,
        },
        { headers: headers },
      )
      .pipe(
        tap((token: any) => {
          localStorage.setItem('access_token', token.access);
        }),
      );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post(
      `${this.BACKEND_URL}/logout/`,
      {
        refresh: localStorage.getItem('refresh_token'),
      },
      {
        headers,

        observe: 'response',
      },
    ) as Observable<any>;
  }

  register(
    username: string,
    email: string,
    password: string,
    masterPassword: string,
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post(
      `${this.BACKEND_URL}/register/`,
      { username, email, password, masterPassword },
      {
        headers,
        observe: 'response',
      },
    ) as Observable<any>;
  }

  getCurrentUserId(): number {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('access_token') as string;
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.user_id;
    } else {
      return -1;
    }
  }

  fetchUsers(): Observable<any> {
    return this.httpClient.get(`${this.BACKEND_URL}/user/`) as Observable<any>;
  }

  fetchAdmins(): Observable<any> {
    return this.httpClient.get(`${this.BACKEND_URL}/admin/`) as Observable<any>;
  }

  addAdmin(username: string, user_id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpClient.post(
      `${this.BACKEND_URL}/admin/`,
      {
        username,
        user_id,
      },
      { headers, observe: 'response' },
    ) as Observable<any>;
  }

  removeAdmin(username: string, user_id: number): Observable<any> {
    return this.httpClient.delete(`${this.BACKEND_URL}/admin/`, {
      body: { username, user_id },
    }) as Observable<any>;
  }
}
