import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatGPTComponent } from './user-chat-gpt.component';

describe('UserChatGPTComponent', () => {
  let component: UserChatGPTComponent;
  let fixture: ComponentFixture<UserChatGPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChatGPTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChatGPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
