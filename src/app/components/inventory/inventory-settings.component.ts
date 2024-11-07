import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryService, InventoryItem, Category } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="inventory-container">
      <mat-form-field class="search-field" appearance="outline">
        <mat-label>{{ 'common.search' | translate }}</mat-label>
        <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterItems()">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <mat-accordion>
        <mat-expansion-panel *ngFor="let category of categories" [expanded]="true">
          <mat-expansion-panel-header>
            <mat-panel-title>
              {{category.name}}
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="items-list">
            <div *ngFor="let item of getItemsForCategory(category.id)" class="item-row">
              <div class="item-info">
                <span class="item-name">{{item.name}}</span>
              </div>
              
              <div class="item-settings">
                <div class="setting-group">
                  <label>{{ 'inventory.items.currentStock' | translate }}</label>
                  <div class="number-control">
                    <button mat-mini-fab color="primary" (click)="decrementValue(item, 'currentStock')">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <mat-form-field appearance="outline" class="number-input">
                      <input matInput type="number" 
                             [(ngModel)]="item.currentStock"
                             (focus)="onInputFocus($event)"
                             (blur)="updateSettings(item)"
                             min="0">
                    </mat-form-field>
                    <button mat-mini-fab color="primary" (click)="incrementValue(item, 'currentStock')">
                      <mat-icon>add</mat-icon>
                    </button>
                  </div>
                </div>

                <div class="setting-group">
                  <label>{{ 'inventory.items.idealStock' | translate }}</label>
                  <div class="number-control">
                    <button mat-mini-fab color="primary" (click)="decrementValue(item, 'idealStock')">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <mat-form-field appearance="outline" class="number-input">
                      <input matInput type="number" 
                             [(ngModel)]="item.idealStock"
                             (focus)="onInputFocus($event)"
                             (blur)="updateSettings(item)"
                             min="1">
                    </mat-form-field>
                    <button mat-mini-fab color="primary" (click)="incrementValue(item, 'idealStock')">
                      <mat-icon>add</mat-icon>
                    </button>
                  </div>
                </div>

                <div class="setting-group">
                  <label>{{ 'inventory.items.threshold' | translate }}</label>
                  <div class="number-control">
                    <button mat-mini-fab color="warn" (click)="decrementValue(item, 'threshold')">
                      <mat-icon>remove</mat-icon>
                    </button>
                    <mat-form-field appearance="outline" class="number-input">
                      <input matInput type="number" 
                             [(ngModel)]="item.threshold"
                             (focus)="onInputFocus($event)"
                             (blur)="updateSettings(item)"
                             min="0"
                             [max]="item.idealStock">
                    </mat-form-field>
                    <button mat-mini-fab color="warn" (click)="incrementValue(item, 'threshold')">
                      <mat-icon>add</mat-icon>
                    </button>
                  </div>
                </div>

                <button mat-raised-button 
                        color="primary"
                        (click)="saveSettings(item)"
                        class="save-button">
                  {{ 'common.save' | translate }}
                </button>
              </div>
            </div>

            <div *ngIf="getItemsForCategory(category.id).length === 0" class="no-items">
              {{ 'inventory.items.noItems' | translate }}
            </div>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .inventory-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 16px;
    }

    .search-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 16px 0;
    }

    .item-row {
      padding: 20px;
      border-radius: 8px;
      background-color: var(--card-background);
      transition: background-color 0.3s ease;

      &:hover {
        background-color: var(--hover-background);
      }
    }

    .item-info {
      margin-bottom: 20px;
    }

    .item-name {
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--text-color);
    }

    .item-settings {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .setting-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-weight: 500;
        color: var(--text-color);
      }
    }

    .number-control {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;

      .number-input {
        width: 100px;
        margin: 0;
        text-align: center;

        ::ng-deep .mat-mdc-form-field-wrapper {
          padding: 0;
        }

        input {
          text-align: center;
          -moz-appearance: textfield;
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        }
      }

      button {
        transition: transform 0.2s ease;
        &:active {
          transform: scale(0.95);
        }
      }
    }

    .save-button {
      align-self: center;
      min-width: 120px;
      margin-top: 8px;
    }

    .no-items {
      text-align: center;
      padding: 16px;
      color: var(--text-color-secondary);
    }

    @media (max-width: 600px) {
      .inventory-container {
        padding: 8px;
      }

      .item-row {
        padding: 16px;
      }

      .item-settings {
        gap: 16px;
      }

      .number-control {
        flex-wrap: nowrap;
        width: 100%;
        justify-content: space-between;

        .number-input {
          width: 80px;
        }

        button {
          flex-shrink: 0;
        }
      }

      .save-button {
        width: 100%;
        margin-top: 16px;
      }

      .item-name {
        text-align: center;
        margin-bottom: 16px;
      }

      .setting-group label {
        text-align: center;
      }
    }
  `]
})
export class InventorySettingsComponent implements OnInit {
  categories: Category[] = [];
  allItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm: string = '';

  constructor(
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.inventoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.inventoryService.getItems().subscribe(items => {
      this.allItems = items;
      this.filterItems();
    });
  }

  onInputFocus(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    if (input) {
      input.select();
    }
  }

  filterItems() {
    if (!this.searchTerm) {
      this.filteredItems = this.allItems;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredItems = this.allItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      this.getCategoryName(item.category).toLowerCase().includes(searchLower)
    );
  }

  getItemsForCategory(categoryId: string): InventoryItem[] {
    return this.filteredItems.filter(item => item.category === categoryId);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  incrementValue(item: InventoryItem, field: 'currentStock' | 'idealStock' | 'threshold') {
    if (field === 'threshold' && item[field] >= item.idealStock) return;
    item[field]++;
    this.updateSettings(item);
  }

  decrementValue(item: InventoryItem, field: 'currentStock' | 'idealStock' | 'threshold') {
    if (item[field] <= 0) return;
    if (field === 'idealStock' && item[field] <= item.threshold) {
      item.threshold = item[field] - 1;
    }
    item[field]--;
    this.updateSettings(item);
  }

  updateSettings(item: InventoryItem) {
    // Ensure valid values
    item.currentStock = Math.max(0, item.currentStock);
    item.idealStock = Math.max(1, item.idealStock);
    item.threshold = Math.max(0, Math.min(item.threshold, item.idealStock));
  }

  saveSettings(item: InventoryItem) {
    this.inventoryService.updateItem(item.id, {
      currentStock: item.currentStock,
      idealStock: item.idealStock,
      threshold: item.threshold
    });

    this.snackBar.open(
      'inventory.alerts.settingsUpdated',
      undefined,
      { duration: 2000 }
    );
  }
}
