import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { InventoryService, InventoryItem, Category } from '../../services/inventory.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule
  ],
  template: `
    <div class="admin-container">
      <h1>{{ 'inventory.admin.title' | translate }}</h1>

      <mat-tab-group>
        <mat-tab [label]="'inventory.admin.inventory' | translate">
          <mat-card class="content-card">
            <mat-card-header>
              <mat-card-title>{{ 'inventory.admin.allItems' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="items" class="full-width">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>{{ 'inventory.items.name' | translate }}</th>
                  <td mat-cell *matCellDef="let item">{{item.name}}</td>
                </ng-container>

                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef>{{ 'inventory.items.category' | translate }}</th>
                  <td mat-cell *matCellDef="let item">{{getCategoryName(item.category)}}</td>
                </ng-container>

                <ng-container matColumnDef="currentStock">
                  <th mat-header-cell *matHeaderCellDef>{{ 'inventory.items.currentStock' | translate }}</th>
                  <td mat-cell *matCellDef="let item">{{item.currentStock}}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>{{ 'inventory.items.status' | translate }}</th>
                  <td mat-cell *matCellDef="let item">
                    <mat-icon [color]="item.currentStock <= item.threshold ? 'warn' : 'primary'">
                      {{item.currentStock <= item.threshold ? 'warning' : 'check_circle'}}
                    </mat-icon>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['name', 'category', 'currentStock', 'status']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'category', 'currentStock', 'status'];"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <mat-tab [label]="'inventory.categories.title' | translate">
          <mat-card class="content-card">
            <mat-card-header>
              <mat-card-title>{{ 'inventory.categories.title' | translate }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="categories" class="full-width">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>{{ 'inventory.categories.name' | translate }}</th>
                  <td mat-cell *matCellDef="let category">{{category.name}}</td>
                </ng-container>

                <ng-container matColumnDef="itemCount">
                  <th mat-header-cell *matHeaderCellDef>{{ 'inventory.categories.itemCount' | translate }}</th>
                  <td mat-cell *matCellDef="let category">{{getItemCountForCategory(category.id)}}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['name', 'itemCount']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'itemCount'];"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
    }

    .content-card {
      margin: 20px 0;
    }

    .full-width {
      width: 100%;
    }

    table {
      margin-top: 16px;
    }

    .mat-mdc-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .mat-column-status {
      width: 80px;
      text-align: center;
    }

    h1 {
      margin-bottom: 20px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  items: InventoryItem[] = [];
  categories: Category[] = [];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.inventoryService.getItems().subscribe(items => {
      this.items = items;
    });

    this.inventoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  getItemCountForCategory(categoryId: string): number {
    return this.items.filter(item => item.category === categoryId).length;
  }
}
