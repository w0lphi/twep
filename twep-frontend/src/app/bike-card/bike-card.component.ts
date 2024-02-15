import { Component, Input, ViewChild, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Bike, BikeStatus } from '../model/bike';
import { DialogService } from '../service/dialog.service';

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
  @Input("bike") bike!: Bike;
  @Input("showRentBtn") showRentBtn = true;
  @ViewChild("descriptionContainer") descriptionContainer?: ElementRef;
  showMore: boolean = false;
  hasMoreDescription: boolean = false;
  unavailable: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private zone: NgZone,
    private dialogService: DialogService
  ) { 
  }

  ngOnInit(){
    this.unavailable = this.bike?.status !== BikeStatus.AVAILABLE && this.showRentBtn === true;
  }
  
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
      if(this.bike == undefined) return 
      this.dialogService.openBikeRentDialog(this.bike);
    });
  }

  get title(): string {
    const wheelSize: string = `${this.bike?.wheelSize}"`;
    const name: string = this.bike?.model ?? this.bike?.id ?? "";
    return `${wheelSize} ${name}`;
  }

  get category(): string | null {
    return this.bike?.category ?? "";
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
