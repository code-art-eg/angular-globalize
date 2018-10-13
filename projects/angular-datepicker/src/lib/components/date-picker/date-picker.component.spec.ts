import { TestBed, ComponentFixture } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { NextPreviousComponent } from '../next-prev/next-prev.component';
import { DatePickerComponent } from './date-picker.component';
import { DaysViewComponent } from '../days-view/days-view.component';
import { YearsViewComponent } from '../years-view/years-view.component';
import { MonthsViewComponent } from '../months-view/months-view.component';


describe('DatePickerComponent', () => {
    let fixture: ComponentFixture<DatePickerComponent>;
    let component: DatePickerComponent;
    beforeEach(async () => {
        initComponentTest(NextPreviousComponent, YearsViewComponent, MonthsViewComponent, DaysViewComponent, DatePickerComponent);
        fixture = TestBed.createComponent(DatePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('inits correctly', () => {
        expect(component).toBeTruthy();
    });
});
