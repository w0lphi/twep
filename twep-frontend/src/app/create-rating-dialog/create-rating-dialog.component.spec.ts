import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRatingDialogComponent } from './create-rating-dialog.component';

describe('CreateRatingDialogComponent', () => {
  let component: CreateRatingDialogComponent;
  let fixture: ComponentFixture<CreateRatingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRatingDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
