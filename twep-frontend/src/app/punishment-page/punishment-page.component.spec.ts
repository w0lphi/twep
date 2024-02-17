import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunishmentPageComponent } from './punishment-page.component';

describe('PunishmentPageComponent', () => {
  let component: PunishmentPageComponent;
  let fixture: ComponentFixture<PunishmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PunishmentPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PunishmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
