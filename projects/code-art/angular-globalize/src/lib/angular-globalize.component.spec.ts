import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularGlobalizeComponent } from './angular-globalize.component';

describe('AngularGlobalizeComponent', () => {
  let component: AngularGlobalizeComponent;
  let fixture: ComponentFixture<AngularGlobalizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularGlobalizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularGlobalizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
