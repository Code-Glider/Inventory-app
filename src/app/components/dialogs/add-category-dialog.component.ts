import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'inventory.categories.add' | translate }}</h2>
    <mat-dialog-content>
      <mat-form-field class="full-width">
        <mat-label>{{ 'inventory.categories.title' | translate }}</mat-label>
        <input matInput [(ngModel)]="categoryName" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-raised-button color="primary" 
              [disabled]="!categoryName"
              (click)="onSave()">
        {{ 'common.save' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      min-width: 300px;
    }
  `]
})
export class AddCategoryDialogComponent {
  categoryName: string = '';

  constructor(private dialogRef: MatDialogRef<AddCategoryDialogComponent>) {}

  onSave() {
    if (this.categoryName) {
      this.dialogRef.close(this.categoryName);
    }
  }
}
