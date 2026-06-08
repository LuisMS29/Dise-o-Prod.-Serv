import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CultivoService } from '../../../services/cultivo.service';
import { Cultivo, TIPOS_CULTIVO, DISTRITOS_LIMA } from '../../../models/cultivo.model';

@Component({
  selector: 'app-cultivo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="cultivo-form-container">
      <!-- Header -->
      <div class="header">
        <button mat-icon-button routerLink="/cultivos" class="btn-volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="titulo-pantalla">Registrar Cultivo</h1>
      </div>

      <mat-card class="form-card">
        <form [formGroup]="cultivoForm" (ngSubmit)="onSubmit()">
          <!-- Tipo de cultivo -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Tipo de cultivo</mat-label>
            <mat-select formControlName="tipoCultivo">
              <mat-option *ngFor="let tipo of tiposCultivo" [value]="tipo">
                {{ tipo }}
              </mat-option>
            </mat-select>
            <mat-icon matSuffix>eco</mat-icon>
            <mat-error *ngIf="cultivoForm.get('tipoCultivo')?.hasError('required')">
              Seleccione un tipo de cultivo
            </mat-error>
          </mat-form-field>

          <!-- Ubicacion / Distrito -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Ubicacion / Distrito</mat-label>
            <mat-select formControlName="ubicacion">
              <mat-option *ngFor="let distrito of distritos" [value]="distrito">
                {{ distrito }}
              </mat-option>
            </mat-select>
            <mat-icon matSuffix>location_on</mat-icon>
            <mat-error *ngIf="cultivoForm.get('ubicacion')?.hasError('required')">
              Seleccione una ubicacion
            </mat-error>
          </mat-form-field>

          <!-- Hectareas -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Hectareas</mat-label>
            <input matInput formControlName="hectareas" type="number" step="0.1" placeholder="2.5">
            <span matSuffix>ha</span>
            <mat-error *ngIf="cultivoForm.get('hectareas')?.hasError('min')">
              Debe ser mayor a 0
            </mat-error>
          </mat-form-field>

          <!-- Fecha de siembra -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Fecha de siembra</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="fechaSiembra">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <!-- Geolocalizacion automatica -->
          <div class="geolocalizacion" *ngIf="ubicacionActual">
            <mat-icon>my_location</mat-icon>
            <span class="texto-secundario">
              Ubicacion detectada: {{ ubicacionActual.lat | number:'1.4-4' }}, 
              {{ ubicacionActual.lng | number:'1.4-4' }}
            </span>
          </div>

          <button mat-button type="button" class="btn-geo" (click)="obtenerUbicacion()">
            <mat-icon>gps_fixed</mat-icon>
            Detectar mi ubicacion
          </button>

          <!-- Error -->
          <div *ngIf="errorMensaje" class="error-message">
            <mat-icon>error</mat-icon>
            <span>{{ errorMensaje }}</span>
          </div>

          <!-- Boton Guardar -->
          <button mat-raised-button 
                  class="btn-primario w-100 mt-16" 
                  type="submit" 
                  [disabled]="cultivoForm.invalid || cargando">
            <mat-spinner *ngIf="cargando" diameter="20" class="spinner-inline"></mat-spinner>
            <span *ngIf="!cargando">GUARDAR CULTIVO</span>
          </button>
        </form>
      </mat-card>

      <!-- Menu inferior -->
      <nav class="menu-inferior">
        <a routerLink="/dashboard" class="menu-item">
          <mat-icon>home</mat-icon>
          <span>Inicio</span>
        </a>
        <a routerLink="/cultivos" class="menu-item activo">
          <mat-icon>agriculture</mat-icon>
          <span>Cultivos</span>
        </a>
        <a routerLink="/alertas" class="menu-item">
          <mat-icon>notifications</mat-icon>
          <span>Alertas</span>
        </a>
        <a routerLink="/perfil" class="menu-item">
          <mat-icon>person</mat-icon>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .cultivo-form-container {
      min-height: 100vh;
      background: #FFFFFF;
      padding: 16px 16px 80px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .btn-volver {
      color: #424242;
    }

    .form-card {
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    mat-form-field {
      margin-bottom: 8px;
    }

    .geolocalizacion {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #E3F2FD;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .geolocalizacion mat-icon {
      color: #1976D2;
    }

    .btn-geo {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976D2;
      margin-bottom: 16px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #FF5252;
      background: #FFEBEE;
      padding: 12px;
      border-radius: 8px;
      margin: 12px 0;
      font-size: 14px;
    }

    .spinner-inline {
      display: inline-block;
      margin-right: 8px;
    }

    .menu-inferior {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-around;
      padding: 8px 0;
      z-index: 1000;
    }

    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #757575;
      text-decoration: none;
      font-size: 12px;
      padding: 4px 16px;
    }

    .menu-item mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      margin-bottom: 2px;
    }

    .menu-item.activo {
      color: #1976D2;
    }
  `]
})
export class CultivoFormComponent {
  cultivoForm: FormGroup;
  tiposCultivo = TIPOS_CULTIVO;
  distritos = DISTRITOS_LIMA;
  cargando = false;
  errorMensaje = '';
  ubicacionActual: { lat: number; lng: number } | null = null;

  constructor(
    private fb: FormBuilder,
    private cultivoService: CultivoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.cultivoForm = this.fb.group({
      tipoCultivo: ['', Validators.required],
      ubicacion: ['', Validators.required],
      hectareas: [null, [Validators.min(0.01)]],
      fechaSiembra: [null],
      latitud: [null],
      longitud: [null]
    });
  }

  obtenerUbicacion(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ubicacionActual = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.cultivoForm.patchValue({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          });
          this.snackBar.open('Ubicacion detectada correctamente', 'Cerrar', { duration: 2000 });
        },
        () => {
          this.snackBar.open('No se pudo obtener la ubicacion. Seleccione manualmente.', 'Cerrar', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Geolocalizacion no disponible en este dispositivo', 'Cerrar', { duration: 3000 });
    }
  }

  onSubmit(): void {
    if (this.cultivoForm.invalid) return;

    this.cargando = true;
    this.errorMensaje = '';

    const cultivo: Cultivo = this.cultivoForm.value;

    this.cultivoService.registrarCultivo(cultivo).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.exito) {
          this.snackBar.open(response.mensaje, 'Cerrar', { duration: 3000 });
          this.router.navigate(['/cultivos']);
        } else {
          this.errorMensaje = response.mensaje;
        }
      },
      error: (error) => {
        this.cargando = false;
        this.errorMensaje = error.error?.mensaje || 'Error al registrar cultivo. Intente mas tarde.';
      }
    });
  }
}
