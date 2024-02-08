import { Component, Input, ViewChild, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Bike } from '../model/bike';
import { BikeModel } from '../model/bikeModel';
import { MatDialog } from '@angular/material/dialog';
import { BikeRentDialogComponent } from '../bike-rent-dialog/bike-rent-dialog.component';

@Component({
  selector: 'app-bike-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './bike-card.component.html',
  styleUrl: './bike-card.component.scss'
})
export class BikeCardComponent {
  @Input("bike") bike?: Bike;
  @ViewChild("descriptionContainer") descriptionContainer?: ElementRef;
  showMore: boolean = false;
  hasMoreDescription: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private zone: NgZone,
    private dialog: MatDialog,
  ) { }
  
  ngAfterViewInit() {

    const nativeElement: HTMLDivElement | undefined = this.descriptionContainer?.nativeElement;
    if (nativeElement !== undefined) {
      const observer: MutationObserver = new MutationObserver(() => {
        const clientHeight: number = nativeElement.clientHeight;
        const scrollHeight: number = nativeElement.scrollHeight;
        this.hasMoreDescription = clientHeight < scrollHeight;
        this.changeDetector.detectChanges();
      });

      observer.observe(nativeElement, {
        attributes: true,
        characterData: true,
      });
    }
  }

  toggleFeatures(): void {
    this.showMore = !this.showMore;
    this.changeDetector.detectChanges();
  }

  rentBike() {
    this.zone.run(() => {
        this.dialog.open(BikeRentDialogComponent, {
          data: {
              bike: this.bike,
          },
          width: "600px",
          disableClose: true,
          hasBackdrop: true,
      })
    });
  }

  get title(): string {
    const wheelSize: string = `${this.bike?.wheelSize}"`;
    const name: string = this.bike?.model ?? this.bike?.id ?? "";
    return `${wheelSize} ${name}`;
  }

  get category(): string | null {
    return this.bike?.bikeCategory ?? "";
  }

  get description(): string | null{
    return this.bike?.description ?? null;
  }

  get hasMoreBtnText(): string {
    return ` Show ${this.showMore ? 'less' : 'more' }`
  }

  get features(): string[] {
    return this.bike?.extraFeatures ?? [];
  }
}
