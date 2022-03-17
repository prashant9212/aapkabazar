import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySkeletonComponent } from './category-skeleton.component';

describe('CategorySkeletonComponent', () => {
  let component: CategorySkeletonComponent;
  let fixture: ComponentFixture<CategorySkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorySkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
