import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertaService } from '../../services/alerta.service';
import { AuthService } from '../../services/auth.service';
import { AudioService } from '../../services/audio.service';
import { EstadoSemaforo, Alerta } from '../../models/alerta.model';
import { Usuario } from '../../models/usuario.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Barra superior -->
      <div class="barra-superior">
        <div class="ubicacion">
          <mat-icon>location_on</mat-icon>
          <span class="texto-secundario">Lima Norte, Peru</span>
        </div>
        <div class="conexion" [class.online]="online">
          <mat-icon>{{ online ? 'wifi' : 'wifi_off' }}</mat-icon>
          <span class="texto-secundario">{{ online ? 'En linea' : 'Sin internet' }}</span>
        </div>
      </div>

      <!-- SISTEMA SEMAFORO (60% de pantalla) -->
      <div class="semaforo-section" [ngClass]="'semaforo-' + semaforo.nivelRiesgo?.toLowerCase()">
        <div class="semaforo-contenido">
          <mat-icon class="semaforo-icono">
            {{ getIconoSemaforo() }}
          </mat-icon>
          <h2 class="texto-alerta-critica text-center">{{ semaforo.titulo }}</h2>
          <p class="cuerpo-texto text-center">{{ semaforo.descripcion }}</p>

          <div *ngIf="semaforo.accionRecomendada" class="accion-recomendada">
            <mat-icon>lightbulb</mat-icon>
            <span>{{ semaforo.accionRecomendada }}</span>
          </div>

          <!-- Boton audio -->
          <button mat-raised-button 
                  class="btn-audio" 
                  (click)="reproducirAudio()"
                  *ngIf="usuario?.audioActivado">
            <mat-icon>{{ reproduciendo ? 'stop' : 'volume_up' }}</mat-icon>
            {{ reproduciendo ? 'Detener' : 'Escuchar alerta' }}
          </button>
        </div>
      </div>

      <!-- Boton de accion principal (20%) -->
      <div class="accion-section">
        <button mat-raised-button class="btn-accion-principal" routerLink="/cultivos/nuevo">
          <mat-icon>add</mat-icon>
          Registrar Cultivo
        </button>
      </div>

      <!-- Alertas recientes -->
      <div class="alertas-section" *ngIf="alertas.length > 0">
        <h3 class="titulo-seccion">Alertas recientes</h3>
        <div class="alerta-card" *ngFor="let alerta of alertas.slice(0, 3)" 
             [ngClass]="'alerta-' + alerta.nivelRiesgo.toLowerCase()"
             (click)="marcarLeida(alerta.id!)">
          <div class="alerta-header">
            <mat-icon>{{ getIconoAlerta(alerta.tipoAlerta) }}</mat-icon>
            <span class="alerta-titulo">{{ alerta.titulo }}</span>
            <span class="alerta-badge" *ngIf="!alerta.leida">NUEVA</span>
          </div>
          <p class="texto-secundario">{{ alerta.descripcion }}</p>
        </div>
      </div>

      <!-- MENU INFERIOR -->
      <nav class="menu-inferior">
        <a routerLink="/dashboard" routerLinkActive="activo" class="menu-item">
          <mat-icon>home</mat-icon>
          <span>Inicio</span>
        </a>
        <a routerLink="/cultivos" routerLinkActive="activo" class="menu-item">
          <mat-icon>agriculture</mat-icon>
          <span>Cultivos</span>
        </a>
        <a routerLink="/alertas" routerLinkActive="activo" class="menu-item">
          <mat-icon [matBadge]="alertasNoLeidas" [matBadgeHidden]="alertasNoLeidas === 0" matBadgeColor="warn">notifications</mat-icon>
          <span>Alertas</span>
        </a>
        <a routerLink="/perfil" routerLinkActive="activo" class="menu-item">
          <mat-icon>person</mat-icon>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #FFFFFF;
      padding-bottom: 80px;
    }

    /* Barra superior */
    .barra-superior {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #F5F5F5;
      border-bottom: 1px solid #E0E0E0;
    }

    .ubicacion, .conexion {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .conexion.online mat-icon {
      color: #2E7D32;
    }

    /* Semaforo - 60% de pantalla */
    .semaforo-section {
      min-height: 50vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      transition: all 0.5s ease;
    }

    .semaforo-verde {
      background: linear-gradient(180deg, #69F0AE 0%, #2E7D32 100%);
      color: #424242;
    }

    .semaforo-amarillo {
      background: linear-gradient(180deg, #FFD740 0%, #FF8F00 100%);
      color: #424242;
    }

    .semaforo-rojo {
      background: linear-gradient(180deg, #FF5252 0%, #C62828 100%);
      color: #FFFFFF;
      animation: pulse-semaforo 2s infinite;
    }

    @keyframes pulse-semaforo {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.9; }
    }

    .semaforo-contenido {
      text-align: center;
      max-width: 400px;
    }

    .semaforo-icono {
      font-size: 80px;
      width: 80px;
      height: 80px;
      margin-bottom: 16px;
    }

    .semaforo-rojo .semaforo-icono {
      animation: shake 0.5s infinite;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .accion-recomendada {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.2);
      padding: 12px 16px;
      border-radius: 12px;
      margin-top: 16px;
      font-size: 16px;
      font-weight: 500;
    }

    .btn-audio {
      margin-top: 20px;
      background: rgba(255,255,255,0.3) !important;
      color: inherit !important;
      border: 2px solid rgba(255,255,255,0.5);
      border-radius: 24px;
      padding: 12px 24px;
    }

    /* Accion principal */
    .accion-section {
      padding: 20px 16px;
      text-align: center;
    }

    .btn-accion-principal {
      background-color: #1976D2 !important;
      color: white !important;
      font-size: 16px;
      padding: 16px 32px;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
    }

    /* Alertas */
    .alertas-section {
      padding: 0 16px 16px;
    }

    .titulo-seccion {
      font-size: 18px;
      font-weight: 700;
      color: #424242;
      margin-bottom: 12px;
    }

    .alerta-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-left: 4px solid #757575;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .alerta-card:hover {
      transform: translateX(4px);
    }

    .alerta-verde { border-left-color: #2E7D32; }
    .alerta-amarillo { border-left-color: #FFD740; }
    .alerta-rojo { border-left-color: #FF5252; background: #FFEBEE; }

    .alerta-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .alerta-titulo {
      font-weight: 700;
      flex: 1;
      color: #424242;
    }

    .alerta-badge {
      background: #FF5252;
      color: white;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 700;
    }

    /* Menu inferior */
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
export class DashboardComponent implements OnInit, OnDestroy {
  semaforo: EstadoSemaforo = {
    nivelRiesgo: 'VERDE',
    colorHex: '#2E7D32',
    mensajeAudio: 'Sin alertas. Condiciones favorables',
    titulo: 'Sin alertas',
    descripcion: 'Condiciones favorables para sus cultivos',
    accionRecomendada: 'Continue con sus actividades normales'
  };

  alertas: Alerta[] = [];
  alertasNoLeidas = 0;
  usuario: Usuario | null = null;
  online = navigator.onLine;
  reproduciendo = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private alertaService: AlertaService,
    private authService: AuthService,
    private audioService: AudioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    this.cargarSemaforo();
    this.cargarAlertas();
    this.contarNoLeidas();

    // Detectar conexion
    window.addEventListener('online', () => this.online = true);
    window.addEventListener('offline', () => this.online = false);

    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      this.cargarSemaforo();
      this.cargarAlertas();
    }, 30000);

    this.subscriptions.push(new Subscription(() => clearInterval(interval)));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.audioService.detener();
  }

  cargarSemaforo(): void {
    const sub = this.alertaService.obtenerEstadoSemaforo().subscribe({
      next: (response) => {
        if (response.exito && response.data) {
          this.semaforo = response.data;
        }
      }
    });
    this.subscriptions.push(sub);
  }

  cargarAlertas(): void {
    const sub = this.alertaService.obtenerAlertas().subscribe({
      next: (response) => {
        if (response.exito) {
          this.alertas = response.data || [];
        }
      }
    });
    this.subscriptions.push(sub);
  }

  contarNoLeidas(): void {
    const sub = this.alertaService.contarNoLeidas().subscribe({
      next: (response) => {
        if (response.exito) {
          this.alertasNoLeidas = response.data || 0;
        }
      }
    });
    this.subscriptions.push(sub);
  }

  marcarLeida(id: number): void {
    this.alertaService.marcarComoLeida(id).subscribe(() => {
      this.contarNoLeidas();
    });
  }

  reproducirAudio(): void {
    if (this.reproduciendo) {
      this.audioService.detener();
      this.reproduciendo = false;
      return;
    }

    if (this.semaforo.mensajeAudio) {
      this.audioService.reproducirMensaje(this.semaforo.mensajeAudio);
      this.reproduciendo = true;

      // Simular fin de reproduccion
      setTimeout(() => {
        this.reproduciendo = false;
      }, 5000);
    }
  }

  getIconoSemaforo(): string {
    switch (this.semaforo.nivelRiesgo) {
      case 'VERDE': return 'check_circle';
      case 'AMARILLO': return 'warning';
      case 'ROJO': return 'error';
      default: return 'info';
    }
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
