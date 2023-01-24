import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsViewComponent } from './maps-view.component';

describe('MapsViewComponent', () => {
  let component: MapsViewComponent;
  let fixture: ComponentFixture<MapsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
