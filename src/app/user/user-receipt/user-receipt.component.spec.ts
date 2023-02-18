import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReceiptComponent } from './user-receipt.component';

describe('UserReceiptComponent', () => {
  let component: UserReceiptComponent;
  let fixture: ComponentFixture<UserReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
