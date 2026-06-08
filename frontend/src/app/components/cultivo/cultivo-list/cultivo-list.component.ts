import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CultivoService } from '../../../services/cultivo.service';
import { Cultivo } from '../../../models/cultivo.model';

@Component({
  selector: 'app-cultivo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="cultivos-container">
      <!-- Header -->
      <div class="header">
        <button mat-icon-button routerLink="/dashboard" class="btn-volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="titulo-pantalla">Mis Cultivos</h1>
        <button mat-mini-fab class="btn-naranja" routerLink="/cultivos/nuevo">
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <!-- Lista de cultivos -->
      <div class="cultivos-lista" *ngIf="cultivos.length > 0">
        <mat-card class="cultivo-card" *ngFor="let cultivo of cultivos">
          <div class="cultivo-header">
            <mat-icon class="cultivo-icono">eco</mat-icon>
            <div class="cultivo-info">
              <h3 class="cultivo-nombre">{{ cultivo.tipoCultivo }}</h3>
              <p class="texto-secundario">
                <mat-icon>location_on</mat-icon>
                {{ cultivo.ubicacion }}
              </p>
            </div>
            <mat-chip [class.zona-ok]="cultivo.zonaCobertura" [class.zona-no]="!cultivo.zonaCobertura">
              {{ cultivo.zonaCobertura ? 'Cobertura OK' : 'Sin cobertura' }}
            </mat-chip>
          </div>

          <div class="cultivo-detalles">
            <div class="detalle-item" *ngIf="cultivo.hectareas">
              <mat-icon>square_foot</mat-icon>
              <span>{{ cultivo.hectareas }} hectareas</span>
            </div>
            <div class="detalle-item" *ngIf="cultivo.fechaSiembra">
              <mat-icon>calendar_today</mat-icon>
              <span>Siembra: {{ cultivo.fechaSiembra | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>

          <div class="cultivo-acciones">
            <button mat-button class="btn-secundario" (click)="confirmarEliminar(cultivo)">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </div>
        </mat-card>
      </div>

      <!-- Sin cultivos -->
      <div class="sin-cultivos" *ngIf="cultivos.length === 0 && !cargando">
        <mat-icon class="sin-cultivos-icono">agriculture</mat-icon>
        <h3 class="titulo-pantalla text-center">No tiene cultivos registrados</h3>
        <p class="texto-secundario text-center">Registre su primer cultivo para recibir alertas</p>
        <button mat-raised-button class="btn-primario" routerLink="/cultivos/nuevo">
          <mat-icon>add</mat-icon>
          Registrar Cultivo
        </button>
      </div>

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
    .cultivos-container {
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

    .btn-naranja {
      background-color: #FF6F00 !important;
      color: white !important;
      margin-left: auto;
    }

    .cultivo-card {
      margin-bottom: 16px;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .cultivo-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }

    .cultivo-icono {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #2E7D32;
    }

    .cultivo-info {
      flex: 1;
    }

    .cultivo-nombre {
      font-size: 18px;
      font-weight: 700;
      color: #424242;
      margin: 0 0 4px;
    }

    .cultivo-info p {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0;
    }

    .cultivo-info mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #757575;
    }

    .zona-ok {
      background-color: #E8F5E9 !important;
      color: #2E7D32 !important;
    }

    .zona-no {
      background-color: #FFEBEE !important;
      color: #FF5252 !important;
    }

    .cultivo-detalles {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      padding: 12px;
      background: #F5F5F5;
      border-radius: 8px;
    }

    .detalle-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #424242;
    }

    .detalle-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #757575;
    }

    .cultivo-acciones {
      display: flex;
      justify-content: flex-end;
    }

    .sin-cultivos {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      gap: 16px;
    }

    .sin-cultivos-icono {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #E0E0E0;
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
export class CultivoListComponent implements OnInit {
  cultivos: Cultivo[] = [];
  cargando = false;

  constructor(
    private cultivoService: CultivoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarCultivos();
  }

  cargarCultivos(): void {
    this.cargando = true;
    this.cultivoService.obtenerCultivos().subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.exito) {
          this.cultivos = response.data || [];
        }
      },
      error: () => {
        this.cargando = false;
        this.snackBar.open('Error al cargar cultivos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  confirmarEliminar(cultivo: Cultivo): void {
    if (confirm(`¿Esta seguro de eliminar el cultivo de ${cultivo.tipoCultivo}?`)) {
      this.cultivoService.eliminarCultivo(cultivo.id!).subscribe({
        next: (response) => {
          if (response.exito) {
            this.snackBar.open('Cultivo eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.cargarCultivos();
          }
        },
        error: () => {
          this.snackBar.open('Error al eliminar cultivo', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
