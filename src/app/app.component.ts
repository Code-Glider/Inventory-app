import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslationService } from './services/translation.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <div [dir]="currentLang === 'he' ? 'rtl' : 'ltr'" class="app-container">
      <mat-toolbar color="primary" class="toolbar">
        <div class="toolbar-row">
          <span class="app-title">
            {{ 'inventory.title' | translate }}
          </span>

          <div class="toolbar-actions">
            <button mat-icon-button (click)="toggleDarkMode()">
              <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>

            <button mat-icon-button [matMenuTriggerFor]="languageMenu">
              <mat-icon>language</mat-icon>
            </button>
            
            <mat-menu #languageMenu="matMenu">
              <button mat-menu-item (click)="switchLanguage('he')">
                עברית
              </button>
              <button mat-menu-item (click)="switchLanguage('en')">
                English
              </button>
            </mat-menu>

            <ng-container *ngIf="isAuthenticated">
              <button mat-icon-button 
                      routerLink="/dashboard"
                      routerLinkActive="active-link">
                <mat-icon>dashboard</mat-icon>
              </button>

              <button mat-icon-button 
                      *ngIf="isAdmin"
                      routerLink="/admin"
                      routerLinkActive="active-link">
                <mat-icon>admin_panel_settings</mat-icon>
              </button>

              <button mat-icon-button (click)="logout()">
                <mat-icon>logout</mat-icon>
              </button>
            </ng-container>
          </div>
        </div>
      </mat-toolbar>

      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .toolbar {
      display: flex;
      flex-direction: column;
      padding: 0;
    }

    .toolbar-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 16px;
      min-height: 56px;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .content {
      flex: 1;
      overflow-y: auto;
      background-color: var(--background-color);
    }

    .app-title {
      font-size: 1.2rem;
      white-space: nowrap;
    }

    .active-link {
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 600px) {
      .toolbar-row {
        padding: 8px;
      }

      .app-title {
        font-size: 1rem;
      }

      .content {
        padding: 0;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  currentLang = 'he';
  isAuthenticated = false;
  isAdmin = false;
  isDarkMode = false;

  constructor(
    private translationService: TranslationService,
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyTheme();
  }

  ngOnInit() {
    this.translationService.getCurrentLang().subscribe(lang => {
      this.currentLang = lang;
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.isAuthenticated = !!user;
      this.isAdmin = user?.role === 'admin';
      
      if (!this.isAuthenticated && !this.router.url.includes('login')) {
        this.router.navigate(['/login']);
      }
    });
  }

  switchLanguage(lang: string) {
    this.translationService.switchLanguage(lang);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
}
