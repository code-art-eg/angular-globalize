import { TestBed, async, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CultureSwitchComponent } from './components/culture-switch/culture-switch.component';
import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES } from '@code-art-eg/angular-globalize';

describe('AppComponent', () => {
  let component: CultureSwitchComponent;
  let fixture: ComponentFixture<CultureSwitchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CultureSwitchComponent, AppComponent ],
      imports: [
        AngularGlobalizeModule.forRoot(),
        AngularGlobalizeModule,
      ],
      providers: [
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'de', 'ar-EG'] },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CultureSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
