import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { InventoryService, InventoryItem, Category } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
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
                <div class="item-details">
                  <span class="stock-label">{{ 'inventory.items.currentStock' | translate }}:</span>
                  <span class="stock-value" [class.low-stock]="item.currentStock <= item.threshold">
                    {{item.currentStock}} / {{item.idealStock}}
                  </span>
                </div>
                <div class="item-details" *ngIf="item.currentStock <= item.threshold">
                  <span class="warning-text">
                    <mat-icon class="warning-icon">warning</mat-icon>
                    {{ 'inventory.alerts.lowStock' | translate }}
                  </span>
                </div>
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
      gap: 12px;
      padding: 8px 0;
    }

    .item-row {
      padding: 16px;
      border-radius: 8px;
      background-color: var(--card-background);
      transition: background-color 0.3s ease;

      &:hover {
        background-color: var(--hover-background);
      }
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item-name {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .item-details {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stock-label {
      color: var(--text-color);
      opacity: 0.7;
    }

    .stock-value {
      font-weight: 500;

      &.low-stock {
        color: #f44336;
      }
    }

    .warning-text {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #f44336;
      font-size: 0.9rem;
    }

    .warning-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
    }

    .no-items {
      text-align: center;
      padding: 16px;
      opacity: 0.6;
    }

    @media (max-width: 600px) {
      .inventory-container {
        padding: 8px;
      }

      .item-row {
        padding: 12px;
      }
    }
  `]
})
export class InventoryViewComponent implements OnInit {
  categories: Category[] = [];
  allItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm: string = '';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.inventoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.inventoryService.getItems().subscribe(items => {
      this.allItems = items;
      this.filterItems();
    });
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
}
