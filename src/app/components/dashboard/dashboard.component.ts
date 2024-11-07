import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryService } from '../../services/inventory.service';
import { AddItemDialogComponent } from '../dialogs/add-item-dialog.component';
import { AddCategoryDialogComponent } from '../dialogs/add-category-dialog.component';
import { TranslationService } from '../../services/translation.service';
import { InventoryViewComponent } from '../inventory/inventory-view.component';
import { InventoryManageComponent } from '../inventory/inventory-manage.component';
import { InventorySettingsComponent } from '../inventory/inventory-settings.component';
import { InventoryHistoryComponent } from '../inventory/inventory-history.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    InventoryViewComponent,
    InventoryManageComponent,
    InventorySettingsComponent,
    InventoryHistoryComponent
  ],
  template: `
    <div class="dashboard-container">
      <div class="content-wrapper">
        <div class="stats-section">
          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>{{ 'inventory.dashboard.totalItems' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">{{totalItems}}</div>
              <mat-icon color="primary">inventory_2</mat-icon>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>{{ 'inventory.dashboard.lowStock' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">{{lowStockCount}}</div>
              <mat-icon [color]="lowStockCount > 0 ? 'warn' : 'primary'">warning</mat-icon>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>{{ 'inventory.dashboard.categories' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">{{categoryCount}}</div>
              <mat-icon color="accent">category</mat-icon>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="onAddItem()">
            <mat-icon>add</mat-icon>
            {{ 'inventory.items.add' | translate }}
          </button>
          <button mat-raised-button color="accent" (click)="onAddCategory()">
            <mat-icon>category</mat-icon>
            {{ 'inventory.categories.add' | translate }}
          </button>
        </div>

        <mat-tab-group [selectedIndex]="selectedTab" (selectedIndexChange)="onTabChange($event)" class="main-tabs">
          <mat-tab [label]="'inventory.view.title' | translate">
            <div class="tab-content">
              <app-inventory-view></app-inventory-view>
            </div>
          </mat-tab>
          <mat-tab [label]="'inventory.manage.title' | translate">
            <div class="tab-content">
              <app-inventory-manage></app-inventory-manage>
            </div>
          </mat-tab>
          <mat-tab [label]="'inventory.settings.title' | translate">
            <div class="tab-content">
              <app-inventory-settings></app-inventory-settings>
            </div>
          </mat-tab>
          <mat-tab [label]="'inventory.history.title' | translate">
            <div class="tab-content">
              <app-inventory-history></app-inventory-history>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100%;
      background-color: var(--background-color);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .content-wrapper {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      box-sizing: border-box;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
      width: 100%;
    }

    .stat-card {
      background-color: var(--card-background);
      text-align: center;
      
      ::ng-deep .mat-mdc-card-header {
        justify-content: center;
        text-align: center;
      }

      .mat-card-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 16px;
      }

      .stat-value {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--text-color);
      }

      .mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      margin: 20px 0;
      width: 100%;
      justify-content: center;

      button {
        flex: 1;
        max-width: 200px;
      }
    }

    .main-tabs {
      width: 100%;
      margin-top: 20px;
      background-color: var(--card-background);
      border-radius: 8px;
      overflow: hidden;
    }

    .tab-content {
      padding: 20px 0;
    }

    @media (max-width: 600px) {
      .content-wrapper {
        padding: 12px;
      }

      .stats-section {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .stat-card {
        margin: 0 auto;
        max-width: 300px;
        width: 100%;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
        gap: 8px;
        
        button {
          max-width: 300px;
          width: 100%;
        }
      }

      .tab-content {
        padding: 12px 0;
      }

      .main-tabs {
        margin: 12px -12px;
        width: calc(100% + 24px);
        border-radius: 0;
      }

      ::ng-deep {
        .mat-mdc-tab-label-container {
          justify-content: center;
        }

        .mat-mdc-tab {
          flex: 1;
          min-width: 0;
          padding: 0 12px;
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalItems: number = 0;
  lowStockCount: number = 0;
  categoryCount: number = 0;
  selectedTab: number = 0;

  constructor(
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.inventoryService.getItems()
      .pipe(
        catchError(error => {
          console.error('Error loading items:', error);
          return of([]);
        })
      )
      .subscribe(() => {
        this.updateCounts();
      });

    this.inventoryService.getCategories()
      .pipe(
        catchError(error => {
          console.error('Error loading categories:', error);
          return of([]);
        })
      )
      .subscribe(() => {
        this.updateCounts();
      });

    this.updateCounts();
  }

  private updateCounts() {
    this.totalItems = this.inventoryService.getTotalItems();
    this.lowStockCount = this.inventoryService.getLowStockCount();
    this.categoryCount = this.inventoryService.getCategoryCount();
  }

  onAddItem() {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      direction: this.translationService.getCurrentLangValue() === 'he' ? 'rtl' : 'ltr'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventoryService.addItem(result);
        this.showSuccessMessage('inventory.alerts.success');
      }
    });
  }

  onAddCategory() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      direction: this.translationService.getCurrentLangValue() === 'he' ? 'rtl' : 'ltr'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventoryService.addCategory(result);
        this.showSuccessMessage('inventory.alerts.success');
      }
    });
  }

  onTabChange(index: number) {
    this.selectedTab = index;
  }

  private showSuccessMessage(messageKey: string) {
    this.snackBar.open(
      this.translationService.instant(messageKey),
      undefined,
      { duration: 3000 }
    );
  }
}
