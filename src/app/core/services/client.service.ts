import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Client } from '../models/client';
import { environment } from 'src/environments/environment';
import { ClientFilters } from 'src/app/core/models/clientFilters';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getClientBySharedKey(sharedKey: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${sharedKey}`).pipe(
      catchError(this.handleError)
    );
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la API:', error);
    return throwError(() => new Error(error.message));
  }

  getFilteredClients(filters: ClientFilters): Observable<Client[]> {
    return this.http.post<Client[]>(`${this.apiUrl}/search`, filters).pipe(
      catchError(this.handleError)
    );
  }

  searchClients(sharedKey: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/search`, {
      params: { sharedKey }
    }).pipe(
      catchError(this.handleError)
    );
  }

  exportClients(filters: ClientFilters): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, filters, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }
}
