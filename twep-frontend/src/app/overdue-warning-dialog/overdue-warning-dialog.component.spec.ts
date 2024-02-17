import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueWarningDialogComponent } from './overdue-warning-dialog.component';

describe('OverdueWarningDialogComponent', () => {
  let component: OverdueWarningDialogComponent;
  let fixture: ComponentFixture<OverdueWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverdueWarningDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverdueWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
