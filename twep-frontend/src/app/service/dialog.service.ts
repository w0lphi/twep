import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from '../common/prompt-dialog/prompt-dialog.component';
import { BikeRentDialogComponent } from '../bike-rent-dialog/bike-rent-dialog.component';
import { firstValueFrom } from 'rxjs';
import { Bike } from '../model/bike';

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
  
  async openPromptDialog(title: string, text: string, label: string, initialValue?: string): Promise<string | null> {
    this.promptDialogRef = this.dialog.open(PromptDialogComponent, {
          data: {
              title,
              text,
              label,
              initialValue
          },
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
        width: "600px",
        disableClose: true,
        hasBackdrop: true,
    })
  }
}
