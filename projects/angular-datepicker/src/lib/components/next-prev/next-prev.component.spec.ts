import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NextPreviousComponent } from './next-prev.component';
import { CurrentCultureService } from '@code-art/angular-globalize';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';


describe('NextPreviousComponent', () => {
    let fixture: ComponentFixture<NextPreviousComponent>;
    let component: NextPreviousComponent;
    beforeEach(async () => {
        initComponentTest(NextPreviousComponent);
        fixture = TestBed.createComponent(NextPreviousComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('inits correctly', () => {
        expect(component.locale).toBe(null);
        expect(component.text).toBe(null);
        expect(component.resetButton).toBe(true);
        expect(component.homeButton).toBe(true);
    });

    it('gets correct arrows', () => {
        const cultureService: CurrentCultureService = TestBed.get(CurrentCultureService);

        expect(component.isRtl).toBe(false);
        cultureService.currentCulture = 'en-GB';
        expect(component.isRtl).toBe(false);
        cultureService.currentCulture = 'ar';
        expect(component.isRtl).toBe(true);
    });
});
