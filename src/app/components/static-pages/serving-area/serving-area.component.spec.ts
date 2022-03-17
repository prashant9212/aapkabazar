import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServingAreaComponent } from './serving-area.component';

describe('ServingAreaComponent', () => {
  let component: ServingAreaComponent;
  let fixture: ComponentFixture<ServingAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
