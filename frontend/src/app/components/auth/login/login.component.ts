import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <div class="logo-section">
          <mat-icon class="logo-icon">agriculture</mat-icon>
          <h1 class="titulo-pantalla text-center">AgroPredice Peru</h1>
          <p class="texto-secundario text-center">Alertas climaticas para agricultores</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- Telefono -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Telefono</mat-label>
            <input matInput formControlName="telefono" placeholder="+51987654321" type="tel">
            <mat-icon matSuffix>phone</mat-icon>
            <mat-error *ngIf="loginForm.get('telefono')?.hasError('required')">
              El telefono es obligatorio
            </mat-error>
            <mat-error *ngIf="loginForm.get('telefono')?.hasError('pattern')">
              Ingrese un telefono valido (minimo 9 digitos)
            </mat-error>
          </mat-form-field>

          <!-- Password -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Contrasena</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              La contrasena es obligatoria
            </mat-error>
          </mat-form-field>

          <!-- Error -->
          <div *ngIf="errorMensaje" class="error-message">
            <mat-icon>error</mat-icon>
            <span>{{ errorMensaje }}</span>
          </div>

          <!-- Boton Login -->
          <button mat-raised-button 
                  class="btn-primario w-100 mt-16" 
                  type="submit" 
                  [disabled]="loginForm.invalid || cargando">
            <mat-spinner *ngIf="cargando" diameter="20" class="spinner-inline"></mat-spinner>
            <span *ngIf="!cargando">INICIAR SESION</span>
          </button>
        </form>

        <div class="registro-link mt-16 text-center">
          <p class="texto-secundario">¿No tiene cuenta?</p>
          <a routerLink="/registro" class="link-registro">Registrarse aqui</a>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1976D2 0%, #2E7D32 100%);
      padding: 16px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }

    .logo-section {
      text-align: center;
      margin-bottom: 24px;
    }

    .logo-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #2E7D32;
    }

    mat-form-field {
      margin-bottom: 8px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #FF5252;
      background: #FFEBEE;
      padding: 12px;
      border-radius: 8px;
      margin: 16px 0;
      font-size: 14px;
    }

    .spinner-inline {
      display: inline-block;
      margin-right: 8px;
    }

    .registro-link {
      margin-top: 24px;
    }

    .link-registro {
      color: #1976D2;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
    }

    .link-registro:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  cargando = false;
  errorMensaje = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      telefono: ['', [Validators.required, Validators.pattern('^[+]?[0-9]{9,15}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.cargando = true;
    this.errorMensaje = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.exito) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMensaje = response.mensaje;
        }
      },
      error: (error) => {
        this.cargando = false;
        this.errorMensaje = error.error?.mensaje || 'Error al iniciar sesion. Intente mas tarde.';
      }
    });
  }
}
