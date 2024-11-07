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
import { InventoryService, InventoryItem, Category } from '../../services/inventory.service';

interface GroupedItems {
  [categoryId: string]: InventoryItem[];
}

@Component({
  selector: 'app-inventory-list',
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
    MatDividerModule
  ],
  template: `
    <div class="inventory-container">
      <mat-form-field class="search-field">
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
                <span class="item-stock" [class.low-stock]="item.currentStock <= item.threshold">
                  {{item.currentStock}} / {{item.idealStock}}
                </span>
              </div>
              
              <div class="item-actions">
                <button mat-icon-button color="warn" 
                        (click)="decrementStock(item)"
                        [disabled]="item.currentStock <= 0">
                  <mat-icon>remove_circle</mat-icon>
                </button>
                <span class="stock-number">{{item.currentStock}}</span>
                <button mat-icon-button color="primary" 
                        (click)="incrementStock(item)"
                        [disabled]="item.currentStock >= item.idealStock">
                  <mat-icon>add_circle</mat-icon>
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
      gap: 12px;
      padding: 8px 0;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.02);

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-name {
      font-weight: 500;
    }

    .item-stock {
      font-size: 0.9em;
      color: rgba(0, 0, 0, 0.6);

      &.low-stock {
        color: #f44336;
      }
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stock-number {
      min-width: 40px;
      text-align: center;
      font-weight: 500;
    }

    .no-items {
      text-align: center;
      padding: 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    [dir='rtl'] {
      .item-actions {
        flex-direction: row-reverse;
      }
    }
  `]
})
export class InventoryListComponent implements OnInit {
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

  incrementStock(item: InventoryItem) {
    if (item.currentStock < item.idealStock) {
      this.inventoryService.updateItem(item.id, {
        currentStock: item.currentStock + 1
      });
    }
  }

  decrementStock(item: InventoryItem) {
    if (item.currentStock > 0) {
      this.inventoryService.updateItem(item.id, {
        currentStock: item.currentStock - 1
      });
    }
  }
}
