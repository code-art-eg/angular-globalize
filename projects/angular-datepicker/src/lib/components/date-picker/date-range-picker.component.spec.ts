import { TestBed, ComponentFixture } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { NextPreviousComponent } from '../next-prev/next-prev.component';
import { DaysViewComponent } from '../days-view/days-view.component';
import { YearsViewComponent } from '../years-view/years-view.component';
import { MonthsViewComponent } from '../months-view/months-view.component';
import { DateRangePickerComponent } from './date-range-picker.component';


describe('DateRangePickerComponent', () => {
    let fixture: ComponentFixture<DateRangePickerComponent>;
    let component: DateRangePickerComponent;
    beforeEach(async () => {
        initComponentTest(NextPreviousComponent, YearsViewComponent, MonthsViewComponent, DaysViewComponent, DateRangePickerComponent);
        fixture = TestBed.createComponent(DateRangePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('inits correctly', () => {
        expect(component).toBeTruthy();
    });
});
