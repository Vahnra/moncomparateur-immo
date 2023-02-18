import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectionIndexComponent } from './prospection-index.component';

describe('ProspectionIndexComponent', () => {
  let component: ProspectionIndexComponent;
  let fixture: ComponentFixture<ProspectionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProspectionIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
