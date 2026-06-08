import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alerta, EstadoSemaforo } from '../models/alerta.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private apiUrl = `${environment.apiUrl}/alertas`;

  constructor(private http: HttpClient) {}

  obtenerAlertas(): Observable<ApiResponse<Alerta[]>> {
    return this.http.get<ApiResponse<Alerta[]>>(this.apiUrl);
  }

  obtenerAlertasActivas(): Observable<ApiResponse<Alerta[]>> {
    return this.http.get<ApiResponse<Alerta[]>>(`${this.apiUrl}/activas`);
  }

  obtenerAlertasNoLeidas(): Observable<ApiResponse<Alerta[]>> {
    return this.http.get<ApiResponse<Alerta[]>>(`${this.apiUrl}/no-leidas`);
  }

  obtenerEstadoSemaforo(): Observable<ApiResponse<EstadoSemaforo>> {
    return this.http.get<ApiResponse<EstadoSemaforo>>(`${this.apiUrl}/semaforo`);
  }

  contarNoLeidas(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/contador`);
  }

  marcarComoLeida(id: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}/leida`, {});
  }
}
