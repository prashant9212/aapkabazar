import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiseProductsComponent } from './advertise-products.component';

describe('AdvertiseProductsComponent', () => {
  let component: AdvertiseProductsComponent;
  let fixture: ComponentFixture<AdvertiseProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertiseProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertiseProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
