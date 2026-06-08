import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cultivo } from '../models/cultivo.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CultivoService {
  private apiUrl = `${environment.apiUrl}/cultivos`;

  constructor(private http: HttpClient) {}

  obtenerCultivos(): Observable<ApiResponse<Cultivo[]>> {
    return this.http.get<ApiResponse<Cultivo[]>>(this.apiUrl);
  }

  obtenerCultivoPorId(id: number): Observable<ApiResponse<Cultivo>> {
    return this.http.get<ApiResponse<Cultivo>>(`${this.apiUrl}/${id}`);
  }

  registrarCultivo(cultivo: Cultivo): Observable<ApiResponse<Cultivo>> {
    return this.http.post<ApiResponse<Cultivo>>(this.apiUrl, cultivo);
  }

  eliminarCultivo(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
