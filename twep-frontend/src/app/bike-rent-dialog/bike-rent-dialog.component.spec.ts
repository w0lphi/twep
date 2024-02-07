import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeRentDialogComponent } from './bike-rent-dialog.component';

describe('BikeRentDialogComponent', () => {
  let component: BikeRentDialogComponent;
  let fixture: ComponentFixture<BikeRentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeRentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BikeRentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
