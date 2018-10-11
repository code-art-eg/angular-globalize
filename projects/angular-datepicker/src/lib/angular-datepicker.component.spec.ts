import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularDatepickerComponent } from './angular-datepicker.component';

describe('AngularDatepickerComponent', () => {
  let component: AngularDatepickerComponent;
  let fixture: ComponentFixture<AngularDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
