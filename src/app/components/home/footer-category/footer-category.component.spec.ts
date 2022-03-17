import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCategoryComponent } from './footer-category.component';

describe('FooterCategoryComponent', () => {
  let component: FooterCategoryComponent;
  let fixture: ComponentFixture<FooterCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
