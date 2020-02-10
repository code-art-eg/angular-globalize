import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LanguageSwitchComponent } from './components/language-switch/language-switch.component';
import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES } from '@code-art/angular-globalize';

describe('AppComponent', () => {
  let component: LanguageSwitchComponent;
  let fixture: ComponentFixture<LanguageSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageSwitchComponent, AppComponent ],
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
    fixture = TestBed.createComponent(LanguageSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
