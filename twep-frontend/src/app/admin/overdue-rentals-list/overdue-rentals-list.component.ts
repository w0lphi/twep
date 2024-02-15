import { Component } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { AdminTableComponent } from '../admin-table/admin-table.component';

@Component({
  selector: 'app-overdue-rentals-list',
  standalone: true,
  imports: [
    AdminTableComponent,
    MatTableModule
  ],
  templateUrl: './overdue-rentals-list.component.html',
  styleUrl: './overdue-rentals-list.component.scss'
})
export class OverdueRentalsListComponent {
  runningAction: boolean = false;
  overdueRentals: any[] = [];


  getOverdueRentals(){

  }

  get columns(): string[]{
    return [
      "user",
      "ticket",
    ]
  }
}
