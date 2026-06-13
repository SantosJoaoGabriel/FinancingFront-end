import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutStateService {
  private sidebarHiddenSubject = new BehaviorSubject<boolean>(false);
  sidebarHidden$ = this.sidebarHiddenSubject.asObservable();

  hideSidebar() {
    this.sidebarHiddenSubject.next(true);
  }

  showSidebar() {
    this.sidebarHiddenSubject.next(false);
  }
}
