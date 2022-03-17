import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCategorySkeletonComponent } from './footer-category-skeleton.component';

describe('FooterCategorySkeletonComponent', () => {
  let component: FooterCategorySkeletonComponent;
  let fixture: ComponentFixture<FooterCategorySkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterCategorySkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterCategorySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
