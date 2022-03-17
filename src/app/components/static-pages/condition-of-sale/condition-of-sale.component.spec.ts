import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionOfSaleComponent } from './condition-of-sale.component';

describe('ConditionOfSaleComponent', () => {
  let component: ConditionOfSaleComponent;
  let fixture: ComponentFixture<ConditionOfSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionOfSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionOfSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
