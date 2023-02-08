import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectMapComponent } from './user-project-map.component';

describe('UserProjectMapComponent', () => {
  let component: UserProjectMapComponent;
  let fixture: ComponentFixture<UserProjectMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProjectMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
