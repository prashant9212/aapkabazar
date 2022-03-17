import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandProductListComponent } from './brand-product-list.component';

describe('BrandProductListComponent', () => {
  let component: BrandProductListComponent;
  let fixture: ComponentFixture<BrandProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
