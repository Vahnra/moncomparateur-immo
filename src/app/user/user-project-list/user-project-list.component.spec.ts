import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectListComponent } from './user-project-list.component';

describe('UserProjectListComponent', () => {
  let component: UserProjectListComponent;
  let fixture: ComponentFixture<UserProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProjectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
