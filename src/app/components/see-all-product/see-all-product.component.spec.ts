import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllProductComponent } from './see-all-product.component';

describe('SeeAllProductComponent', () => {
  let component: SeeAllProductComponent;
  let fixture: ComponentFixture<SeeAllProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeAllProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeAllProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
