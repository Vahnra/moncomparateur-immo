import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContactsAddComponent } from './user-contacts-add.component';

describe('UserContactsAddComponent', () => {
  let component: UserContactsAddComponent;
  let fixture: ComponentFixture<UserContactsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserContactsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserContactsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
