import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'inventory.items.add' | translate }}</h2>
    <mat-dialog-content>
      <form #itemForm="ngForm" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'inventory.items.name' | translate }}</mat-label>
          <input matInput [(ngModel)]="item.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'inventory.items.category' | translate }}</mat-label>
          <mat-select [(ngModel)]="item.category" name="category" required>
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{category.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'inventory.items.currentStock' | translate }}</mat-label>
          <input matInput 
                 type="number" 
                 inputmode="numeric" 
                 pattern="[0-9]*"
                 [(ngModel)]="item.currentStock" 
                 name="currentStock" 
                 required
                 class="number-input">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'inventory.items.idealStock' | translate }}</mat-label>
          <input matInput 
                 type="number" 
                 inputmode="numeric" 
                 pattern="[0-9]*"
                 [(ngModel)]="item.idealStock" 
                 name="idealStock" 
                 required
                 class="number-input">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'inventory.items.threshold' | translate }}</mat-label>
          <input matInput 
                 type="number" 
                 inputmode="numeric" 
                 pattern="[0-9]*"
                 [(ngModel)]="item.threshold" 
                 name="threshold" 
                 required
                 class="number-input">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" class="dialog-button">
        {{ 'common.cancel' | translate }}
      </button>
      <button mat-raised-button 
              color="primary" 
              [disabled]="!itemForm.form.valid" 
              (click)="onSubmit()"
              class="dialog-button">
        {{ 'common.save' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
      max-width: 400px;
      padding: 16px 0;
    }

    mat-form-field {
      width: 100%;
    }

    .dialog-button {
      min-width: 88px;
      margin-left: 8px;
    }

    @media (max-width: 600px) {
      .dialog-form {
        min-width: unset;
        width: 100%;
        padding: 8px 0;
      }

      /* Hide spinner buttons for number inputs */
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }

      .number-input {
        font-size: 18px !important;
      }

      .dialog-button {
        min-width: 96px;
        height: 48px;
        font-size: 16px;
      }

      ::ng-deep {
        .mat-mdc-dialog-container {
          padding: 16px !important;
        }

        .mat-mdc-form-field-infix {
          min-height: 48px;
          padding: 12px 0 !important;
        }

        .mat-mdc-text-field-wrapper {
          padding: 0 12px !important;
        }

        .mat-mdc-form-field-flex {
          min-height: 48px;
        }

        .mat-mdc-dialog-actions {
          padding: 16px 0 0 0;
          margin-bottom: 0;
        }
      }
    }
  `]
})
export class AddItemDialogComponent {
  item: any = {
    name: '',
    category: '',
    currentStock: 0,
    idealStock: 0,
    threshold: 0
  };

  categories: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddItemDialogComponent>,
    private inventoryService: InventoryService
  ) {
    this.loadCategories();
  }

  private loadCategories() {
    this.inventoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // Ensure values are non-negative integers
    this.item.currentStock = Math.max(0, Math.floor(Number(this.item.currentStock)));
    this.item.idealStock = Math.max(0, Math.floor(Number(this.item.idealStock)));
    this.item.threshold = Math.max(0, Math.floor(Number(this.item.threshold)));
    
    this.dialogRef.close(this.item);
  }
}
