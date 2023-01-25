import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvfMapsComponent } from './dvf-maps.component';

describe('DvfMapsComponent', () => {
  let component: DvfMapsComponent;
  let fixture: ComponentFixture<DvfMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DvfMapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DvfMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
