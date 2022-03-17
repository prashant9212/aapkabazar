import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellwithusComponent } from './sellwithus.component';

describe('SellwithusComponent', () => {
  let component: SellwithusComponent;
  let fixture: ComponentFixture<SellwithusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellwithusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellwithusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
