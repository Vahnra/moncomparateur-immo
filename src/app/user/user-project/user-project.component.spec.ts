import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectComponent } from './user-project.component';

describe('UserProjectComponent', () => {
  let component: UserProjectComponent;
  let fixture: ComponentFixture<UserProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
