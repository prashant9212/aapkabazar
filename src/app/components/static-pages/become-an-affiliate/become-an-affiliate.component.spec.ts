import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAnAffiliateComponent } from './become-an-affiliate.component';

describe('BecomeAnAffiliateComponent', () => {
  let component: BecomeAnAffiliateComponent;
  let fixture: ComponentFixture<BecomeAnAffiliateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeAnAffiliateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeAnAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
