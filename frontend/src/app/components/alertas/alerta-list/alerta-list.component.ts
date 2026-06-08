import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { AlertaService } from '../../../services/alerta.service';
import { AudioService } from '../../../services/audio.service';
import { Alerta } from '../../../models/alerta.model';

@Component({
  selector: 'app-alerta-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatBadgeModule
  ],
  template: `
    <div class="alertas-container">
      <!-- Header -->
      <div class="header">
        <button mat-icon-button routerLink="/dashboard" class="btn-volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="titulo-pantalla">Mis Alertas</h1>
      </div>

      <!-- Filtros -->
      <div class="filtros">
        <button mat-button 
                [class.activo]="filtro === 'todas'" 
                (click)="cambiarFiltro('todas')">
          Todas
        </button>
        <button mat-button 
                [class.activo]="filtro === 'no-leidas'" 
                (click)="cambiarFiltro('no-leidas')">
          No leidas
          <span class="badge" *ngIf="alertasNoLeidas > 0">{{ alertasNoLeidas }}</span>
        </button>
      </div>

      <!-- Lista de alertas -->
      <div class="alertas-lista" *ngIf="alertasFiltradas.length > 0">
        <mat-card class="alerta-card" 
                  *ngFor="let alerta of alertasFiltradas"
                  [ngClass]="'alerta-' + alerta.nivelRiesgo.toLowerCase()">

          <div class="alerta-header">
            <div class="alerta-icono-seccion">
              <mat-icon class="alerta-icono">{{ getIconoAlerta(alerta.tipoAlerta) }}</mat-icon>
            </div>
            <div class="alerta-info">
              <div class="alerta-titulo-row">
                <h3 class="alerta-titulo">{{ alerta.titulo }}</h3>
                <mat-chip [class]="'chip-' + alerta.nivelRiesgo.toLowerCase()">
                  {{ alerta.nivelRiesgo }}
                </mat-chip>
              </div>
              <p class="texto-secundario">{{ alerta.descripcion }}</p>
              <p class="alerta-fecha">{{ alerta.fechaGeneracion | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
          </div>

          <!-- Accion recomendada -->
          <div class="alerta-accion" *ngIf="alerta.accionRecomendada">
            <mat-icon>lightbulb</mat-icon>
            <span>{{ alerta.accionRecomendada }}</span>
          </div>

          <!-- Acciones -->
          <div class="alerta-acciones">
            <button mat-button class="btn-audio" (click)="reproducirAudio(alerta)">
              <mat-icon>volume_up</mat-icon>
              Escuchar
            </button>
            <button mat-button 
                    class="btn-leida" 
                    (click)="marcarLeida(alerta.id!)"
                    *ngIf="!alerta.leida">
              <mat-icon>done</mat-icon>
              Marcar leida
            </button>
            <span class="leida-badge" *ngIf="alerta.leida">
              <mat-icon>check_circle</mat-icon>
              Leida
            </span>
          </div>

          <!-- Estado SMS -->
          <div class="sms-estado" *ngIf="alerta.nivelRiesgo === 'ROJO'">
            <mat-icon [class.enviado]="alerta.smsEnviado">
              {{ alerta.smsEnviado ? 'sms' : 'sms_failed' }}
            </mat-icon>
            <span class="texto-secundario">
              {{ alerta.smsEnviado ? 'SMS enviado a su telefono' : 'SMS pendiente' }}
            </span>
          </div>
        </mat-card>
      </div>

      <!-- Sin alertas -->
      <div class="sin-alertas" *ngIf="alertasFiltradas.length === 0 && !cargando">
        <mat-icon class="sin-alertas-icono">notifications_off</mat-icon>
        <h3 class="titulo-pantalla text-center">No hay alertas</h3>
        <p class="texto-secundario text-center">
          {{ filtro === 'no-leidas' ? 'Todas las alertas han sido leidas' : 'No tiene alertas registradas' }}
        </p>
      </div>

      <!-- Menu inferior -->
      <nav class="menu-inferior">
        <a routerLink="/dashboard" class="menu-item">
          <mat-icon>home</mat-icon>
          <span>Inicio</span>
        </a>
        <a routerLink="/cultivos" class="menu-item">
          <mat-icon>agriculture</mat-icon>
          <span>Cultivos</span>
        </a>
        <a routerLink="/alertas" class="menu-item activo">
          <mat-icon [matBadge]="alertasNoLeidas" [matBadgeHidden]="alertasNoLeidas === 0" matBadgeColor="warn">notifications</mat-icon>
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
    .alertas-container {
      min-height: 100vh;
      background: #FFFFFF;
      padding: 16px 16px 80px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .btn-volver {
      color: #424242;
    }

    .filtros {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .filtros button {
      border-radius: 20px;
      padding: 4px 16px;
      font-size: 14px;
    }

    .filtros button.activo {
      background-color: #1976D2;
      color: white;
    }

    .badge {
      background: #FF5252;
      color: white;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
      margin-left: 6px;
    }

    .alerta-card {
      margin-bottom: 16px;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-left: 5px solid #757575;
      overflow: hidden;
    }

    .alerta-verde { border-left-color: #2E7D32; background: #F1F8E9; }
    .alerta-amarillo { border-left-color: #FFD740; background: #FFFDE7; }
    .alerta-rojo { border-left-color: #FF5252; background: #FFEBEE; }

    .alerta-header {
      display: flex;
      gap: 12px;
      padding: 16px;
    }

    .alerta-icono-seccion {
      display: flex;
      align-items: flex-start;
    }

    .alerta-icono {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .alerta-verde .alerta-icono { color: #2E7D32; }
    .alerta-amarillo .alerta-icono { color: #FF8F00; }
    .alerta-rojo .alerta-icono { color: #FF5252; }

    .alerta-info {
      flex: 1;
    }

    .alerta-titulo-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;
    }

    .alerta-titulo {
      font-size: 16px;
      font-weight: 700;
      color: #424242;
      margin: 0;
      flex: 1;
    }

    .chip-verde { background-color: #E8F5E9 !important; color: #2E7D32 !important; }
    .chip-amarillo { background-color: #FFF8E1 !important; color: #FF8F00 !important; }
    .chip-rojo { background-color: #FFEBEE !important; color: #FF5252 !important; }

    .alerta-fecha {
      font-size: 12px;
      color: #9E9E9E;
      margin: 4px 0 0;
    }

    .alerta-accion {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(0,0,0,0.03);
      margin: 0 16px;
      border-radius: 8px;
      font-size: 14px;
      color: #424242;
    }

    .alerta-acciones {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
    }

    .btn-audio {
      color: #1976D2 !important;
    }

    .btn-leida {
      color: #2E7D32 !important;
    }

    .leida-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #2E7D32;
      font-size: 14px;
    }

    .sms-estado {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-top: 1px solid #E0E0E0;
      font-size: 13px;
    }

    .sms-estado mat-icon {
      color: #9E9E9E;
      font-size: 18px;
    }

    .sms-estado mat-icon.enviado {
      color: #2E7D32;
    }

    .sin-alertas {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 40vh;
      gap: 16px;
    }

    .sin-alertas-icono {
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
export class AlertaListComponent implements OnInit {
  alertas: Alerta[] = [];
  alertasFiltradas: Alerta[] = [];
  alertasNoLeidas = 0;
  filtro: 'todas' | 'no-leidas' = 'todas';
  cargando = false;

  constructor(
    private alertaService: AlertaService,
    private audioService: AudioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarAlertas();
    this.contarNoLeidas();
  }

  cargarAlertas(): void {
    this.cargando = true;
    this.alertaService.obtenerAlertas().subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.exito) {
          this.alertas = response.data || [];
          this.filtrarAlertas();
        }
      },
      error: () => {
        this.cargando = false;
        this.snackBar.open('Error al cargar alertas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cambiarFiltro(filtro: 'todas' | 'no-leidas'): void {
    this.filtro = filtro;
    this.filtrarAlertas();
  }

  filtrarAlertas(): void {
    if (this.filtro === 'no-leidas') {
      this.alertasFiltradas = this.alertas.filter(a => !a.leida);
    } else {
      this.alertasFiltradas = this.alertas;
    }
  }

  marcarLeida(id: number): void {
    this.alertaService.marcarComoLeida(id).subscribe({
      next: () => {
        const alerta = this.alertas.find(a => a.id === id);
        if (alerta) {
          alerta.leida = true;
        }
        this.contarNoLeidas();
        this.filtrarAlertas();
        this.snackBar.open('Alerta marcada como leida', 'Cerrar', { duration: 2000 });
      }
    });
  }

  contarNoLeidas(): void {
    this.alertaService.contarNoLeidas().subscribe({
      next: (response) => {
        if (response.exito) {
          this.alertasNoLeidas = response.data || 0;
        }
      }
    });
  }

  reproducirAudio(alerta: Alerta): void {
    const mensaje = `${alerta.titulo}. ${alerta.descripcion}. Accion recomendada: ${alerta.accionRecomendada || 'Mantengase alerta'}`;
    this.audioService.reproducirMensaje(mensaje);
    this.snackBar.open('Reproduciendo alerta...', 'Cerrar', { duration: 2000 });
  }

  getIconoAlerta(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'HELADA': 'ac_unit',
      'LLUVIA_INTENSA': 'water_drop',
      'SEQUIA': 'wb_sunny',
      'VIENTO_FUERTE': 'air',
      'CALOR_EXTREMO': 'thermostat',
      'PLAGA': 'bug_report'
    };
    return iconos[tipo] || 'notifications';
  }
}
