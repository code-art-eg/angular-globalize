import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CultureSwitchComponent } from './culture-switch.component';
import {
  AngularGlobalizeModule,
  CANG_SUPPORTED_CULTURES,
  CurrentCultureService
} from '@code-art-eg/angular-globalize';
import { By } from '@angular/platform-browser';

describe('CultureSwitchComponent', () => {
  let component: CultureSwitchComponent;
  let fixture: ComponentFixture<CultureSwitchComponent>;
  const cultures = ['en-GB', 'de', 'ar-EG'];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CultureSwitchComponent],
      imports: [
        AngularGlobalizeModule.forRoot(),
        AngularGlobalizeModule,
      ],
      providers: [
        { provide: CANG_SUPPORTED_CULTURES, useValue: cultures },
      ],
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(CultureSwitchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a button for each culture', async () => {
    const nodes = fixture.debugElement.queryAll(By.css('button'));
    const cultureService: CurrentCultureService = TestBed.inject(CurrentCultureService);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const button = node.nativeElement as HTMLButtonElement;
      expect(button.innerText.trim()).toBe(cultures[i]);
      button.click();
      await fixture.whenStable();
      expect(cultureService.currentCulture).toBe(cultures[i]);
    }
  });
});
