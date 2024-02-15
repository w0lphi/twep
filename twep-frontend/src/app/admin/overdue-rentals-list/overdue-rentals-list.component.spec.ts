import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueRentalsListComponent } from './overdue-rentals-list.component';

describe('OverdueRentalsListComponent', () => {
  let component: OverdueRentalsListComponent;
  let fixture: ComponentFixture<OverdueRentalsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverdueRentalsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverdueRentalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
