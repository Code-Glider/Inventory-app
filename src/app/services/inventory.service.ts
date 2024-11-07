import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  idealStock: number;
  threshold: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface HistoryEntry {
  id: string;
  date: Date;
  itemId: string;
  itemName: string;
  action: 'add' | 'remove' | 'update' | 'create' | 'delete';
  quantity?: number;
  previousValue?: any;
  newValue?: any;
  user: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private items = new BehaviorSubject<InventoryItem[]>([]);
  private categories = new BehaviorSubject<Category[]>([]);
  private history = new BehaviorSubject<HistoryEntry[]>([]);

  constructor() {
    // Load initial data from localStorage
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedItems = localStorage.getItem('inventoryItems');
    const storedCategories = localStorage.getItem('inventoryCategories');
    const storedHistory = localStorage.getItem('inventoryHistory');

    if (storedItems) {
      this.items.next(JSON.parse(storedItems));
    }
    if (storedCategories) {
      this.categories.next(JSON.parse(storedCategories));
    }
    if (storedHistory) {
      this.history.next(JSON.parse(storedHistory));
    }
  }

  private saveToStorage() {
    localStorage.setItem('inventoryItems', JSON.stringify(this.items.value));
    localStorage.setItem('inventoryCategories', JSON.stringify(this.categories.value));
    localStorage.setItem('inventoryHistory', JSON.stringify(this.history.value));
  }

  getItems(): Observable<InventoryItem[]> {
    return this.items.asObservable();
  }

  getCategories(): Observable<Category[]> {
    return this.categories.asObservable();
  }

  getHistory(): Observable<HistoryEntry[]> {
    return this.history.asObservable();
  }

  addItem(item: Partial<InventoryItem>) {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: item.name || '',
      category: item.category || '',
      currentStock: item.currentStock || 0,
      idealStock: item.idealStock || 0,
      threshold: item.threshold || 0
    };

    const currentItems = this.items.value;
    this.items.next([...currentItems, newItem]);

    this.addHistoryEntry({
      itemId: newItem.id,
      itemName: newItem.name,
      action: 'create',
      newValue: newItem
    });

    this.saveToStorage();
  }

  updateItem(itemId: string, updates: Partial<InventoryItem>) {
    const currentItems = this.items.value;
    const itemIndex = currentItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      const oldItem = currentItems[itemIndex];
      const updatedItem = { ...oldItem, ...updates };
      const newItems = [...currentItems];
      newItems[itemIndex] = updatedItem;
      this.items.next(newItems);

      // Record history for stock changes
      if (updates.currentStock !== undefined && updates.currentStock !== oldItem.currentStock) {
        this.addHistoryEntry({
          itemId,
          itemName: oldItem.name,
          action: updates.currentStock > oldItem.currentStock ? 'add' : 'remove',
          quantity: Math.abs(updates.currentStock - oldItem.currentStock),
          previousValue: oldItem.currentStock,
          newValue: updates.currentStock
        });
      }
      // Record history for other changes
      else if (Object.keys(updates).length > 0) {
        this.addHistoryEntry({
          itemId,
          itemName: oldItem.name,
          action: 'update',
          previousValue: oldItem,
          newValue: updatedItem
        });
      }

      this.saveToStorage();
    }
  }

  addCategory(category: Partial<Category>) {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: category.name || ''
    };

    const currentCategories = this.categories.value;
    this.categories.next([...currentCategories, newCategory]);
    this.saveToStorage();
  }

  private addHistoryEntry(entry: Partial<HistoryEntry>) {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date(),
      itemId: entry.itemId || '',
      itemName: entry.itemName || '',
      action: entry.action || 'update',
      quantity: entry.quantity,
      previousValue: entry.previousValue,
      newValue: entry.newValue,
      user: 'Current User' // TODO: Get from auth service
    };

    const currentHistory = this.history.value;
    this.history.next([...currentHistory, newEntry]);
    this.saveToStorage();
  }

  getTotalItems(): number {
    return this.items.value.length;
  }

  getLowStockCount(): number {
    return this.items.value.filter(item => item.currentStock <= item.threshold).length;
  }

  getCategoryCount(): number {
    return this.categories.value.length;
  }
}
