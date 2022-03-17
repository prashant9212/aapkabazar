import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSkeletonComponent } from './banner-skeleton.component';

describe('BannerSkeletonComponent', () => {
  let component: BannerSkeletonComponent;
  let fixture: ComponentFixture<BannerSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
