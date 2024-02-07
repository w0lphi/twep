import { Component, Input, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Bike } from '../model/bike';
import { BikeModel } from '../model/bikeModel';

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
    private changeDetector: ChangeDetectorRef
  ) { }
  
  ngAfterViewInit() {

    const nativeElement: HTMLDivElement | undefined = this.descriptionContainer?.nativeElement;
    if (nativeElement !== undefined) {
      const observer: MutationObserver = new MutationObserver(() => {
        const clientHeight: number = nativeElement.clientHeight;
        const scrollHeight: number = nativeElement.scrollHeight;
        this.hasMoreDescription = clientHeight < scrollHeight;
        console.log(clientHeight, scrollHeight);
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
    alert(`Rent ${this.bike?.id}`);
  }

  get model(): BikeModel | null {
    return this.bike?.bikeModel ?? null;
  }

  get title(): string {
    return this.model?.name ?? this.bike?.id ?? "";
  }

  get category(): string | null {
    return this.model?.bikeCategory ?? "";
  }

  get description(): string | null{
    return this.model?.description ?? null;
  }

  get hasMoreBtnText(): string {
    return ` Show ${this.showMore ? 'less' : 'more' }`
  }

  get features(): string[] {
    return this.model?.extraFeatures ?? [];
  }
}
