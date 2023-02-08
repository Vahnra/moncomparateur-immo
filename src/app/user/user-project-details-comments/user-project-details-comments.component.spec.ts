import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectDetailsCommentsComponent } from './user-project-details-comments.component';

describe('UserProjectDetailsCommentsComponent', () => {
  let component: UserProjectDetailsCommentsComponent;
  let fixture: ComponentFixture<UserProjectDetailsCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProjectDetailsCommentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectDetailsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
