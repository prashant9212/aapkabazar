import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceDetailTableComponent } from './price-detail-table.component';

describe('PriceDetailTableComponent', () => {
  let component: PriceDetailTableComponent;
  let fixture: ComponentFixture<PriceDetailTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceDetailTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
