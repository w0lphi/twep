import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from '../../common/loading-overlay/loading-overlay.component';
import { BikeStation } from '../../model/bikeStation';
import { BikeStationService } from '../../service/bikeStation.service';

@Component({
  selector: 'app-station-detail',
  standalone: true,
  imports: [LoadingOverlayComponent,CommonModule],
  templateUrl: './station-detail.component.html',
  styleUrl: './station-detail.component.scss'
})
export class StationDetailComponent {
  runningAction: boolean = false;
  bikeStation?: BikeStation;

  @Input()
  set id(stationId: string) {
    this.loadStation(encodeURIComponent(stationId));
  }

  constructor(
    private bikeStationService: BikeStationService
  ){
  }

  loadStation(stationId: string): void{
    this.runningAction = true;
    if(stationId === "new"){
      this.bikeStation = new BikeStation("", "");
      this.runningAction = false;
    }else{
      this.bikeStationService.getBikeStation(stationId).subscribe({
        next: (bikeStation: BikeStation) => {
          this.bikeStation = bikeStation;
          this.runningAction = false;
        },
        error: (error: any) => {
          console.error(error);
          this.runningAction = false;
          //TODO: Handle error
        } 
      })
    }
  }


}
