import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectDetailsComponent } from './user-project-details.component';

describe('UserProjectDetailsComponent', () => {
  let component: UserProjectDetailsComponent;
  let fixture: ComponentFixture<UserProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProjectDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
