import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeFilterListComponent } from './bike-filter-list.component';

describe('BikeFilterListComponent', () => {
  let component: BikeFilterListComponent;
  let fixture: ComponentFixture<BikeFilterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeFilterListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BikeFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
