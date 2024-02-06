import { Component, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
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
  displayFeatures: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef
  ){}

  toggleFeatures(): void {
    this.displayFeatures = !this.displayFeatures;
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

  get featuresBtnText(): string {
    return `${this.displayFeatures ? 'Hide' : 'Show' } features`
  }

  get features(): string[] {
    return this.model?.extraFeatures ?? [];
  }
}
