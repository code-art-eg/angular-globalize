import { TestBed, ComponentFixture } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { NextPreviousComponent } from '../next-prev/next-prev.component';
import { DaysViewComponent } from '../days-view/days-view.component';
import { YearsViewComponent } from '../years-view/years-view.component';
import { MonthsViewComponent } from '../months-view/months-view.component';
import { DateTimePickerComponent } from './datetime-picker.component';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';


describe('DateTimePickerComponent', () => {
    let fixture: ComponentFixture<DateTimePickerComponent>;
    let component: DateTimePickerComponent;
    beforeEach(async () => {
        initComponentTest(NextPreviousComponent, YearsViewComponent, MonthsViewComponent,
            DaysViewComponent, DatePickerComponent, TimePickerComponent, DateTimePickerComponent);
        fixture = TestBed.createComponent(DateTimePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('inits correctly', () => {
        expect(component).toBeTruthy();
    });
});
