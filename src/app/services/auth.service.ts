import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  email: string;
  role: 'admin' | 'technician';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    // Load user from localStorage if exists
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): boolean {
    // For demo purposes, hardcode admin credentials
    if (email === 'admin@example.com' && password === 'admin123') {
      const adminUser: User = { email, role: 'admin' };
      this.currentUser.next(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }
    // Demo technician login
    if (email === 'tech@example.com' && password === 'tech123') {
      const techUser: User = { email, role: 'technician' };
      this.currentUser.next(techUser);
      localStorage.setItem('currentUser', JSON.stringify(techUser));
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  isAdmin(): boolean {
    return this.currentUser.value?.role === 'admin';
  }

  isTechnician(): boolean {
    return this.currentUser.value?.role === 'technician';
  }

  isAuthenticated(): boolean {
    return !!this.currentUser.value;
  }
}
