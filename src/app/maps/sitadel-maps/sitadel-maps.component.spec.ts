import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitadelMapsComponent } from './sitadel-maps.component';

describe('SitadelMapsComponent', () => {
  let component: SitadelMapsComponent;
  let fixture: ComponentFixture<SitadelMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitadelMapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitadelMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
