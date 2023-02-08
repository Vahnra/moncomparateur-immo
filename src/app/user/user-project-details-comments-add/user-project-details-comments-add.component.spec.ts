import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectDetailsCommentsAddComponent } from './user-project-details-comments-add.component';

describe('UserProjectDetailsCommentsAddComponent', () => {
  let component: UserProjectDetailsCommentsAddComponent;
  let fixture: ComponentFixture<UserProjectDetailsCommentsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProjectDetailsCommentsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectDetailsCommentsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
