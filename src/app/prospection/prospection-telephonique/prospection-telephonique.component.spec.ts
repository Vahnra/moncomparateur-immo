import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectionTelephoniqueComponent } from './prospection-telephonique.component';

describe('ProspectionTelephoniqueComponent', () => {
  let component: ProspectionTelephoniqueComponent;
  let fixture: ComponentFixture<ProspectionTelephoniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectionTelephoniqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectionTelephoniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
