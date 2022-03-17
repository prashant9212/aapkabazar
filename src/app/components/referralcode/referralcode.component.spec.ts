import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralcodeComponent } from './referralcode.component';

describe('ReferralcodeComponent', () => {
  let component: ReferralcodeComponent;
  let fixture: ComponentFixture<ReferralcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
