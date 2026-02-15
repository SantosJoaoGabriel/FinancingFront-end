import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="summary-card">
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="value">{{ value | number:'1.2-2' }} BRL</div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }
    .value { font-size: 2em; font-weight: bold; }
  `]
})
export class SummaryCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
}
