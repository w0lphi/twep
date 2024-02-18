import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent, PromptDialogData } from '../common/prompt-dialog/prompt-dialog.component';
import { BikeRentDialogComponent } from '../bike-rent-dialog/bike-rent-dialog.component';
import { Observable, firstValueFrom } from 'rxjs';
import { Bike } from '../model/bike';
import { Ticket } from '../model/ticket';
import { QrCodeDialogComponent } from '../qr-code-dialog/qr-code-dialog.component';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';
import { OverdueWarningDialogComponent } from '../overdue-warning-dialog/overdue-warning-dialog.component';
import { CreateRatingDialogComponent, CreateRatingDialogData } from '../create-rating-dialog/create-rating-dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private confirmDialogRef!: MatDialogRef<ConfirmDialogComponent, boolean>;
  private promptDialogRef!: MatDialogRef<PromptDialogComponent, string | null>;

  constructor(private dialog: MatDialog) {}

    async openConfirmDialog(title: string, text: string): Promise<boolean> {
      this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
              title,
              text,
          },
          disableClose: true,
          hasBackdrop: true,
      });

      const confirmed: boolean | undefined = await firstValueFrom(this.confirmDialogRef.afterClosed());
      return confirmed ?? false;
    }
  
  async openPromptDialog(data: PromptDialogData): Promise<string | null> {
    this.promptDialogRef = this.dialog.open(PromptDialogComponent, {
          data,
          disableClose: true,
          hasBackdrop: true,
          width: '600px',
      });

      const value: string | null | undefined = await firstValueFrom(this.promptDialogRef.afterClosed());
      return value ?? null;
  }

  public openBikeRentDialog(bike: Bike): void {
    this.dialog.open(BikeRentDialogComponent, {
        data: {
            bike,
        },
        width: "800px",
        disableClose: true,
        hasBackdrop: true,
    })
  }

  public openQrCodeDialog(ticket: Ticket): Observable<boolean | undefined>{
    const dialogRef: MatDialogRef<QrCodeDialogComponent, boolean> = this.dialog.open(QrCodeDialogComponent, {
      data: {
        ticket
      },
      width: "400px",
      disableClose: true,
      hasBackdrop: true,
    })

    return dialogRef.afterClosed();
  }

  openBikeCategoryCreateDialog(): Observable<boolean | undefined>{
    const dialogRef: MatDialogRef<CreateCategoryDialogComponent, boolean> = this.dialog.open(CreateCategoryDialogComponent, {
      width: "600px",
      disableClose: true,
      hasBackdrop: true
    });

    return dialogRef.afterClosed();
  }

  openOverdueTicketWarningDialog(): void {
    this.dialog.open(OverdueWarningDialogComponent, {
      width: "600px",
      disableClose: true,
      hasBackdrop: true
    })
  }

  openCreateRatingDialog(data: CreateRatingDialogData): Observable<boolean | undefined>{
    const dialogRef: MatDialogRef<CreateRatingDialogComponent, boolean> = this.dialog.open(CreateRatingDialogComponent, {
      data,
      width: "600px",
      disableClose: true,
      hasBackdrop: true
    });

    return dialogRef.afterClosed();
  }
}
