import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReceiptDetailsComponent } from './user-receipt-details.component';

describe('UserReceiptDetailsComponent', () => {
  let component: UserReceiptDetailsComponent;
  let fixture: ComponentFixture<UserReceiptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReceiptDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReceiptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
