import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectUpdateComponent } from './user-project-update.component';

describe('UserProjectUpdateComponent', () => {
  let component: UserProjectUpdateComponent;
  let fixture: ComponentFixture<UserProjectUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProjectUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
