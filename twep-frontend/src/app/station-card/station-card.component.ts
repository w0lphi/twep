import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BikeStation } from '../model/bikeStation';

import { LoadingOverlayComponent } from '../common/loading-overlay/loading-overlay.component';
import { BikeStationService } from '../service/bikeStation.service';

@Component({
  selector: 'app-station-card',
  standalone: true,
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    LoadingOverlayComponent,
  ],
  templateUrl: './station-card.component.html',
  styleUrl: './station-card.component.scss'
})
export class StationCardComponent {
  runningAction: boolean = false;
  bikeStation?: BikeStation;

  @Input("stationId")
  set stationId(stationId: string) {
    this.getBikeStation(stationId);
  }

  constructor(
    private bikeStationService: BikeStationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  getBikeStation(stationId: string): void {
    this.runningAction = true;
    this.bikeStationService.getBikeStation(stationId).subscribe({
      next: (bikeStation: BikeStation): void => {
        this.bikeStation = bikeStation;
        this.runningAction = false;
        this.changeDetector.detectChanges();
      },
      error: (): void => {
        this.runningAction = false;
         this.changeDetector.detectChanges();
      }
    })
  }
}
