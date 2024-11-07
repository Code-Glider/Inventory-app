import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    TranslateModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>{{ 'auth.login' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onLogin()" #loginForm="ngForm">
            <mat-form-field class="full-width">
              <mat-label>{{ 'auth.email' | translate }}</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>{{ 'auth.password' | translate }}</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required>
            </mat-form-field>

            <div class="button-container">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="!loginForm.form.valid">
                {{ 'auth.login' | translate }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="demo-credentials">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Demo Credentials</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Admin:</strong> admin&#64;example.com / admin123</p>
            <p><strong>Technician:</strong> tech&#64;example.com / tech123</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 64px);
      padding: 20px;
    }

    .login-card {
      max-width: 400px;
      width: 100%;
      margin-bottom: 20px;
    }

    .demo-credentials {
      max-width: 400px;
      width: 100%;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    form {
      display: flex;
      flex-direction: column;
      padding: 20px 0;
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
    }

    mat-card-header {
      margin-bottom: 16px;
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin() {
    if (this.authService.login(this.email, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.snackBar.open('Invalid credentials', 'Close', {
        duration: 3000
      });
    }
  }
}
