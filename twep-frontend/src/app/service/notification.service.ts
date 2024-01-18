import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private snackbar: MatSnackBar,
    private zone: NgZone
  ) {}

  showClientError(message: string): void {
    // The snackbar or dialog won't run outside the Angular's zone. 
    // Wrapping it in the run method fixes this issue.
    this.zone.run(() => {
      this.snackbar.open(`${message}`, 'CLOSE', {
        panelClass: ['twep-error-snackbar'],
      });
    });
  }
}