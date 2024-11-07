import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-manage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
    <div class="manage-container">
      <div class="inventory-grid">
        <mat-card *ngFor="let item of inventory" class="inventory-card">
          <mat-card-header>
            <mat-card-title>{{item.name}}</mat-card-title>
            <mat-card-subtitle>{{getCategoryName(item.category)}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="stock-controls">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'inventory.items.currentStock' | translate }}</mat-label>
                <input matInput 
                       type="number" 
                       inputmode="numeric" 
                       pattern="[0-9]*"
                       [(ngModel)]="item.currentStock" 
                       (change)="onStockChange(item)"
                       class="number-input">
              </mat-form-field>

              <div class="quick-actions">
                <button mat-mini-fab 
                        color="primary" 
                        (click)="adjustStock(item, 1)" 
                        class="action-button">
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-mini-fab 
                        color="warn" 
                        (click)="adjustStock(item, -1)" 
                        [disabled]="item.currentStock <= 0" 
                        class="action-button remove-button"
                        [class.hidden]="item.currentStock <= 0">
                  <mat-icon>remove</mat-icon>
                </button>
              </div>
            </div>

            <div class="stock-info">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'inventory.items.idealStock' | translate }}</mat-label>
                <input matInput 
                       type="number" 
                       inputmode="numeric" 
                       pattern="[0-9]*"
                       [(ngModel)]="item.idealStock" 
                       (change)="onStockChange(item)"
                       class="number-input">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'inventory.items.threshold' | translate }}</mat-label>
                <input matInput 
                       type="number" 
                       inputmode="numeric" 
                       pattern="[0-9]*"
                       [(ngModel)]="item.threshold" 
                       (change)="onStockChange(item)"
                       class="number-input">
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .manage-container {
      padding: 16px;
    }

    .inventory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .inventory-card {
      background-color: var(--card-background);
      
      mat-card-title,
      mat-card-subtitle {
        color: var(--text-color);
      }
    }

    .stock-controls {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;

      mat-form-field {
        flex: 1;
      }
    }

    .quick-actions {
      display: flex;
      gap: 8px;
      z-index: 1;
      position: relative;
    }

    .action-button {
      min-width: 40px !important;
      width: 40px !important;
      height: 40px !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;

      &.remove-button {
        opacity: 1;
        transition: opacity 0.3s ease;

        &.hidden {
          opacity: 0;
          pointer-events: none;
        }
      }

      .mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
      }
    }

    .stock-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .number-input {
      font-size: 16px !important;
      padding: 4px 0;
    }

    @media (max-width: 600px) {
      .manage-container {
        padding: 8px;
      }

      .inventory-grid {
        grid-template-columns: 1fr;
      }

      .stock-info {
        grid-template-columns: 1fr;
      }

      .number-input {
        font-size: 18px !important;
      }

      .action-button {
        min-width: 48px !important;
        width: 48px !important;
        height: 48px !important;

        .mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          line-height: 24px;
        }

        &.remove-button {
          &.hidden {
            display: none !important;
          }
        }
      }

      ::ng-deep {
        .mat-mdc-form-field-infix {
          padding: 8px 0 !important;
        }

        .mat-mdc-text-field-wrapper {
          padding: 0 8px !important;
        }

        .mat-mdc-form-field-flex {
          min-height: 48px;
        }
      }
    }
  `]
})
export class InventoryManageComponent implements OnInit {
  inventory: any[] = [];
  categories: any[] = [];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.inventoryService.getItems().subscribe(items => {
      this.inventory = items;
    });

    this.inventoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  onStockChange(item: any) {
    // Ensure values are non-negative integers
    item.currentStock = Math.max(0, Math.floor(Number(item.currentStock)));
    item.idealStock = Math.max(0, Math.floor(Number(item.idealStock)));
    item.threshold = Math.max(0, Math.floor(Number(item.threshold)));
    
    this.inventoryService.updateItem(item.id, item);
  }

  adjustStock(item: any, amount: number) {
    const newStock = Math.max(0, item.currentStock + amount);
    if (newStock !== item.currentStock) {
      item.currentStock = newStock;
      this.onStockChange(item);
    }
  }
}
