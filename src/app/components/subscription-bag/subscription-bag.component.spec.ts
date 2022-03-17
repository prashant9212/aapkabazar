import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionBagComponent } from './subscription-bag.component';

describe('SubscriptionBagComponent', () => {
  let component: SubscriptionBagComponent;
  let fixture: ComponentFixture<SubscriptionBagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionBagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
