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
  selector: 'app-registro',
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
    <div class="registro-container">
      <mat-card class="registro-card">
        <!-- Boton volver -->
        <button mat-icon-button class="btn-volver" routerLink="/login">
          <mat-icon>arrow_back</mat-icon>
        </button>

        <div class="logo-section">
          <mat-icon class="logo-icon">person_add</mat-icon>
          <h1 class="titulo-pantalla text-center">Crear Cuenta</h1>
          <p class="texto-secundario text-center">Unase a AgroPredice Peru</p>
        </div>

        <form [formGroup]="registroForm" (ngSubmit)="onSubmit()">
          <!-- Nombre -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Nombre completo</mat-label>
            <input matInput formControlName="nombreCompleto" placeholder="Juan Perez">
            <mat-icon matSuffix>person</mat-icon>
            <mat-error *ngIf="registroForm.get('nombreCompleto')?.hasError('required')">
              El nombre es obligatorio
            </mat-error>
            <mat-error *ngIf="registroForm.get('nombreCompleto')?.hasError('minlength')">
              Minimo 3 caracteres
            </mat-error>
          </mat-form-field>

          <!-- Correo -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Correo electronico</mat-label>
            <input matInput formControlName="correo" placeholder="juan@email.com" type="email">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="registroForm.get('correo')?.hasError('required')">
              El correo es obligatorio
            </mat-error>
            <mat-error *ngIf="registroForm.get('correo')?.hasError('email')">
              Formato de correo invalido
            </mat-error>
          </mat-form-field>

          <!-- Telefono -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Telefono</mat-label>
            <input matInput formControlName="telefono" placeholder="+51987654321" type="tel">
            <mat-icon matSuffix>phone_android</mat-icon>
            <mat-error *ngIf="registroForm.get('telefono')?.hasError('required')">
              El telefono es obligatorio
            </mat-error>
            <mat-error *ngIf="registroForm.get('telefono')?.hasError('pattern')">
              Ingrese un telefono valido
            </mat-error>
          </mat-form-field>

          <!-- Password -->
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Contrasena</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-error *ngIf="registroForm.get('password')?.hasError('required')">
              La contrasena es obligatoria
            </mat-error>
            <mat-error *ngIf="registroForm.get('password')?.hasError('minlength')">
              Minimo 6 caracteres
            </mat-error>
          </mat-form-field>

          <!-- Error -->
          <div *ngIf="errorMensaje" class="error-message">
            <mat-icon>error</mat-icon>
            <span>{{ errorMensaje }}</span>
          </div>

          <!-- Exito -->
          <div *ngIf="exitoMensaje" class="exito-message">
            <mat-icon>check_circle</mat-icon>
            <span>{{ exitoMensaje }}</span>
          </div>

          <!-- Boton Registro -->
          <button mat-raised-button 
                  class="btn-primario w-100 mt-16" 
                  type="submit" 
                  [disabled]="registroForm.invalid || cargando">
            <mat-spinner *ngIf="cargando" diameter="20" class="spinner-inline"></mat-spinner>
            <span *ngIf="!cargando">REGISTRARSE</span>
          </button>
        </form>

        <div class="login-link mt-16 text-center">
          <p class="texto-secundario">¿Ya tiene cuenta?</p>
          <a routerLink="/login" class="link-login">Iniciar sesion</a>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .registro-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1976D2 0%, #2E7D32 100%);
      padding: 16px;
    }

    .registro-card {
      width: 100%;
      max-width: 400px;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      position: relative;
    }

    .btn-volver {
      position: absolute;
      top: 16px;
      left: 16px;
      color: #424242;
    }

    .logo-section {
      text-align: center;
      margin-bottom: 24px;
      padding-top: 16px;
    }

    .logo-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #1976D2;
    }

    mat-form-field {
      margin-bottom: 4px;
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

    .exito-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #2E7D32;
      background: #E8F5E9;
      padding: 12px;
      border-radius: 8px;
      margin: 12px 0;
      font-size: 14px;
    }

    .spinner-inline {
      display: inline-block;
      margin-right: 8px;
    }

    .login-link {
      margin-top: 20px;
    }

    .link-login {
      color: #1976D2;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
    }

    .link-login:hover {
      text-decoration: underline;
    }
  `]
})
export class RegistroComponent {
  registroForm: FormGroup;
  hidePassword = true;
  cargando = false;
  errorMensaje = '';
  exitoMensaje = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[+]?[0-9]{9,15}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) return;

    this.cargando = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    this.authService.registro(this.registroForm.value).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.exito) {
          this.exitoMensaje = 'Registro exitoso. Redirigiendo...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        } else {
          this.errorMensaje = response.mensaje;
        }
      },
      error: (error) => {
        this.cargando = false;
        this.errorMensaje = error.error?.mensaje || 'Error al registrarse. Intente mas tarde.';
      }
    });
  }
}
