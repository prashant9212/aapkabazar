import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagProductListComponent } from './tag-product-list.component';

describe('TagProductListComponent', () => {
  let component: TagProductListComponent;
  let fixture: ComponentFixture<TagProductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagProductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
