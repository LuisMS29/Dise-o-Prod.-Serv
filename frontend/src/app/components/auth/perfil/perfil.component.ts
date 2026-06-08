import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  template: `
    <div class="perfil-container">
      <!-- Header -->
      <div class="header">
        <button mat-icon-button routerLink="/dashboard" class="btn-volver">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="titulo-pantalla">Mi Perfil</h1>
      </div>

      <!-- Info del usuario -->
      <mat-card class="perfil-card" *ngIf="usuario">
        <div class="perfil-avatar">
          <mat-icon class="avatar-icon">account_circle</mat-icon>
        </div>
        <h2 class="perfil-nombre">{{ usuario.nombreCompleto }}</h2>
        <p class="texto-secundario">{{ usuario.correo }}</p>
        <p class="texto-secundario">{{ usuario.telefono }}</p>
        <span class="rol-badge">{{ usuario.rol }}</span>
      </mat-card>

      <!-- Configuraciones -->
      <mat-card class="config-card">
        <h3 class="config-titulo">Configuracion</h3>

        <!-- Modo Experto -->
        <div class="config-item">
          <div class="config-info">
            <mat-icon>science</mat-icon>
            <div>
              <span class="config-label">Modo Experto</span>
              <span class="config-desc">Ver datos tecnicos (humedad, presion, UV)</span>
            </div>
          </div>
          <mat-slide-toggle 
            [checked]="usuario?.modoExperto" 
            (change)="cambiarModoExperto($event.checked)"
            color="primary">
          </mat-slide-toggle>
        </div>

        <!-- Audio -->
        <div class="config-item">
          <div class="config-info">
            <mat-icon>volume_up</mat-icon>
            <div>
              <span class="config-label">Alertas por audio</span>
              <span class="config-desc">Escuchar alertas climaticas</span>
            </div>
          </div>
          <mat-slide-toggle 
            [checked]="usuario?.audioActivado" 
            (change)="cambiarAudio($event.checked)"
            color="primary">
          </mat-slide-toggle>
        </div>
      </mat-card>

      <!-- Ayuda -->
      <mat-card class="ayuda-card">
        <h3 class="config-titulo">Ayuda</h3>
        <div class="ayuda-item">
          <mat-icon>help_outline</mat-icon>
          <span>¿Como tomo una buena foto?</span>
        </div>
        <div class="ayuda-item">
          <mat-icon>help_outline</mat-icon>
          <span>¿Que significa el color amarillo?</span>
        </div>
        <div class="ayuda-item">
          <mat-icon>help_outline</mat-icon>
          <span>Video tutorial (30 seg)</span>
        </div>
      </mat-card>

      <!-- Cerrar sesion -->
      <button mat-raised-button class="btn-cerrar-sesion" (click)="cerrarSesion()">
        <mat-icon>logout</mat-icon>
        Cerrar Sesion
      </button>

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
        <a routerLink="/alertas" class="menu-item">
          <mat-icon>notifications</mat-icon>
          <span>Alertas</span>
        </a>
        <a routerLink="/perfil" class="menu-item activo">
          <mat-icon>person</mat-icon>
          <span>Perfil</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .perfil-container {
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

    .perfil-card {
      text-align: center;
      padding: 32px 24px;
      border-radius: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .perfil-avatar {
      margin-bottom: 16px;
    }

    .avatar-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #1976D2;
    }

    .perfil-nombre {
      font-size: 22px;
      font-weight: 700;
      color: #424242;
      margin: 0 0 8px;
    }

    .rol-badge {
      display: inline-block;
      background: #E3F2FD;
      color: #1976D2;
      padding: 4px 16px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      margin-top: 8px;
    }

    .config-card, .ayuda-card {
      padding: 20px;
      border-radius: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .config-titulo {
      font-size: 18px;
      font-weight: 700;
      color: #424242;
      margin: 0 0 16px;
    }

    .config-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid #F5F5F5;
    }

    .config-item:last-child {
      border-bottom: none;
    }

    .config-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .config-info mat-icon {
      color: #1976D2;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .config-label {
      display: block;
      font-size: 16px;
      font-weight: 500;
      color: #424242;
    }

    .config-desc {
      display: block;
      font-size: 13px;
      color: #757575;
    }

    .ayuda-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      color: #424242;
      cursor: pointer;
      border-bottom: 1px solid #F5F5F5;
    }

    .ayuda-item:last-child {
      border-bottom: none;
    }

    .ayuda-item mat-icon {
      color: #1976D2;
    }

    .btn-cerrar-sesion {
      width: 100%;
      background: #FF5252 !important;
      color: white !important;
      padding: 16px;
      border-radius: 12px;
      font-size: 16px;
      margin-top: 16px;
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
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
  }

  cambiarModoExperto(activar: boolean): void {
    // En MVP1, solo actualizamos localmente
    // En MVP2, se conectaria con el backend
    if (this.usuario) {
      this.usuario.modoExperto = activar;
      this.snackBar.open(
        activar ? 'Modo Experto activado' : 'Modo Simple activado',
        'Cerrar',
        { duration: 2000 }
      );
    }
  }

  cambiarAudio(activar: boolean): void {
    if (this.usuario) {
      this.usuario.audioActivado = activar;
      this.snackBar.open(
        activar ? 'Audio activado' : 'Modo silencio activado',
        'Cerrar',
        { duration: 2000 }
      );
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
