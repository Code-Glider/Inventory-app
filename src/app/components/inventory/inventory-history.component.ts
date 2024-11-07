/**
 * @fileoverview This file contains the InventoryHistoryComponent which handles the display and export
 * of inventory history and current inventory data.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { InventoryService, HistoryEntry, InventoryItem } from '../../services/inventory.service';
import { utils, write, WorkSheet, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Custom paginator intl service for Hebrew language support.
 * Extends MatPaginatorIntl to provide translated labels for the paginator component.
 */
export class HebrewPaginatorIntl extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();
    
    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });
    
    this.translateLabels();
  }

  /**
   * Updates all paginator labels with translated text.
   * Called on initialization and language change.
   * @private
   */
  private translateLabels() {
    this.itemsPerPageLabel = this.translate.instant('common.pagination.itemsPerPage');
    this.nextPageLabel = this.translate.instant('common.pagination.nextPage');
    this.previousPageLabel = this.translate.instant('common.pagination.previousPage');
    this.firstPageLabel = this.translate.instant('common.pagination.firstPage');
    this.lastPageLabel = this.translate.instant('common.pagination.lastPage');
    this.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return this.translate.instant('common.pagination.rangeEmpty');
      }

      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      return this.translate.instant('common.pagination.range', {
        startIndex: startIndex + 1,
        endIndex,
        length
      });
    };
    
    this.changes.next();
  }
}

/**
 * Component for displaying and exporting inventory history.
 * Provides functionality to view history entries in a table format and export data in Excel or CSV format.
 */
@Component({
  selector: 'app-inventory-history',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: HebrewPaginatorIntl, deps: [TranslateService] }
  ],
  template: `
    <div class="history-container">
      <div class="export-buttons">
        <button mat-raised-button class="export-button" [matMenuTriggerFor]="exportMenu">
          <mat-icon>download</mat-icon>
          {{ 'inventory.history.export' | translate }}
        </button>
        <mat-menu #exportMenu="matMenu">
          <button mat-menu-item (click)="exportHistory('xlsx')">
            <mat-icon>table_chart</mat-icon>
            {{ 'inventory.export.excel' | translate }}
          </button>
          <button mat-menu-item (click)="exportHistory('csv')">
            <mat-icon>description</mat-icon>
            {{ 'inventory.export.csv' | translate }}
          </button>
        </mat-menu>

        <button mat-raised-button class="export-button" [matMenuTriggerFor]="exportInventoryMenu">
          <mat-icon>inventory_2</mat-icon>
          {{ 'inventory.export.current' | translate }}
        </button>
        <mat-menu #exportInventoryMenu="matMenu">
          <button mat-menu-item (click)="exportCurrentInventory('xlsx')">
            <mat-icon>table_chart</mat-icon>
            {{ 'inventory.export.excel' | translate }}
          </button>
          <button mat-menu-item (click)="exportCurrentInventory('csv')">
            <mat-icon>description</mat-icon>
            {{ 'inventory.export.csv' | translate }}
          </button>
        </mat-menu>
      </div>

      <table mat-table [dataSource]="dataSource" matSort class="history-table">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ 'inventory.history.date' | translate }}
          </th>
          <td mat-cell *matCellDef="let entry">{{entry.date | date:'medium'}}</td>
        </ng-container>

        <ng-container matColumnDef="item">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ 'inventory.history.item' | translate }}
          </th>
          <td mat-cell *matCellDef="let entry">{{entry.itemName}}</td>
        </ng-container>

        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ 'inventory.history.action' | translate }}
          </th>
          <td mat-cell *matCellDef="let entry">
            {{ 'inventory.history.actions.' + entry.action | translate }}
          </td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ 'inventory.history.quantity' | translate }}
          </th>
          <td mat-cell *matCellDef="let entry">{{entry.quantity || '-'}}</td>
        </ng-container>

        <ng-container matColumnDef="user">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ 'inventory.history.user' | translate }}
          </th>
          <td mat-cell *matCellDef="let entry">{{entry.user}}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 100]">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .history-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
    }

    .export-buttons {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      justify-content: flex-end;
    }

    .export-button {
      background-color: #ffffff;
      color: #000000;

      .mat-icon {
        color: #000000;
      }
    }

    .history-table {
      width: 100%;
      background-color: var(--card-background);
      color: var(--text-color);
    }

    .mat-mdc-row,
    .mat-mdc-header-row {
      background-color: var(--card-background);
    }

    .mat-mdc-cell,
    .mat-mdc-header-cell {
      color: var(--text-color);
    }

    ::ng-deep {
      .mat-mdc-menu-content {
        background-color: #ffffff;

        .mat-mdc-menu-item {
          color: #000000;

          .mat-icon {
            color: #000000;
          }
        }
      }

      .mat-mdc-paginator {
        background-color: var(--card-background);
        color: var(--text-color);
      }
    }

    @media (max-width: 600px) {
      .history-container {
        padding: 8px;
      }

      .export-buttons {
        flex-direction: row;
        justify-content: center;
        gap: 8px;
        margin-bottom: 16px;
      }

      .history-table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }
    }
  `]
})
export class InventoryHistoryComponent implements OnInit {
  /** Columns to display in the history table */
  displayedColumns: string[] = ['date', 'item', 'action', 'quantity', 'user'];
  
  /** Data source for the history table */
  dataSource: MatTableDataSource<HistoryEntry>;
  
  /** Current inventory items */
  currentInventory: InventoryItem[] = [];

  /** Reference to the paginator component */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  /** Reference to the sort component */
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * Creates an instance of InventoryHistoryComponent.
   * @param inventoryService Service for managing inventory data
   * @param translateService Service for handling translations
   */
  constructor(
    private inventoryService: InventoryService,
    private translateService: TranslateService
  ) {
    this.dataSource = new MatTableDataSource<HistoryEntry>([]);
  }

  /**
   * Initializes the component by loading history and current inventory data.
   */
  ngOnInit() {
    this.loadHistory();
    this.loadCurrentInventory();
  }

  /**
   * Sets up paginator and sort functionality after view initialization.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Loads history data from the service and sorts it by date.
   * @private
   */
  private loadHistory() {
    this.inventoryService.getHistory().subscribe(history => {
      this.dataSource.data = history.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  /**
   * Loads current inventory data from the service.
   * @private
   */
  private loadCurrentInventory() {
    this.inventoryService.getItems().subscribe(items => {
      this.currentInventory = items;
    });
  }

  /**
   * Exports history data in the specified format.
   * @param format The format to export ('xlsx' or 'csv')
   */
  public exportHistory(format: 'xlsx' | 'csv') {
    const data = this.dataSource.data.map(entry => ({
      [this.translateService.instant('inventory.history.date')]: new Date(entry.date).toLocaleString(),
      [this.translateService.instant('inventory.history.item')]: entry.itemName,
      [this.translateService.instant('inventory.history.action')]: this.translateService.instant(`inventory.history.actions.${entry.action}`),
      [this.translateService.instant('inventory.history.quantity')]: entry.quantity || '-',
      [this.translateService.instant('inventory.history.user')]: entry.user
    }));

    if (format === 'xlsx') {
      this.exportToExcel(data, 'inventory_history');
    } else {
      this.exportToCsv(data, 'inventory_history');
    }
  }

  /**
   * Exports current inventory data in the specified format.
   * @param format The format to export ('xlsx' or 'csv')
   */
  public exportCurrentInventory(format: 'xlsx' | 'csv') {
    this.inventoryService.getCategories().subscribe(categories => {
      const categoryMap = new Map<string, string>();
      categories.forEach(cat => categoryMap.set(cat.id, cat.name));
      
      const data = this.currentInventory.map(item => ({
        [this.translateService.instant('inventory.items.name')]: item.name,
        [this.translateService.instant('inventory.items.category')]: categoryMap.get(item.category) || item.category,
        [this.translateService.instant('inventory.items.currentStock')]: item.currentStock,
        [this.translateService.instant('inventory.items.idealStock')]: item.idealStock,
        [this.translateService.instant('inventory.items.threshold')]: item.threshold
      }));

      if (format === 'xlsx') {
        this.exportToExcel(data, 'current_inventory');
      } else {
        this.exportToCsv(data, 'current_inventory');
      }
    });
  }

  /**
   * Exports data to Excel format.
   * @param data The data to export
   * @param filename The name of the output file (without extension)
   * @private
   */
  private exportToExcel(data: any[], filename: string) {
    // Convert data to worksheet
    const ws: WorkSheet = utils.json_to_sheet(data);
    
    // Set column widths
    const colWidths = Object.keys(data[0]).map(key => ({
      wch: Math.max(key.length * 2, 15) // Width based on header length or minimum of 15
    }));
    ws['!cols'] = colWidths;

    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file
    const wbout = write(wb, { 
      bookType: 'xlsx', 
      type: 'array',
      bookSST: false
    });

    // Create blob and save
    const blob = new Blob([wbout], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  /**
   * Exports data to CSV format.
   * @param data The data to export
   * @param filename The name of the output file (without extension)
   * @private
   */
  private exportToCsv(data: any[], filename: string) {
    if (data.length === 0) return;

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV format with UTF-8 encoding
    const csvData = data.map(row => 
      headers.map(header => {
        let cell = row[header];
        // Handle cells that might contain commas, quotes, or non-ASCII characters
        if (cell && (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || /[^\u0000-\u007f]/.test(cell)))) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    );
    
    // Add headers to the beginning
    csvData.unshift(headers.join(','));
    
    // Create blob with UTF-8 BOM
    const blob = new Blob(
      [new Uint8Array([0xEF, 0xBB, 0xBF]), csvData.join('\n')], 
      { type: 'text/csv;charset=utf-8' }
    );

    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  }
}
