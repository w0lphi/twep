import { Component } from '@angular/core';

import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overdue-warning-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule
  ],
  templateUrl: './overdue-warning-dialog.component.html',
  styleUrl: './overdue-warning-dialog.component.scss'
})
export class OverdueWarningDialogComponent {

  constructor(
    private router: Router,
    private dialog: MatDialogRef<OverdueWarningDialogComponent>
  ){}

  navigateToTickets(){
    this.router.navigateByUrl("/user/tickets");
    this.dialog.close();
  }
}
