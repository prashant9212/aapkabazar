import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoneyStatusComponent } from './add-money-status.component';

describe('AddMoneyStatusComponent', () => {
  let component: AddMoneyStatusComponent;
  let fixture: ComponentFixture<AddMoneyStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoneyStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoneyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
