import { TestBed, ComponentFixture } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { TimePickerComponent } from './time-picker.component';


describe('DateRangePickerComponent', () => {
    let fixture: ComponentFixture<TimePickerComponent>;
    let component: TimePickerComponent;
    beforeEach(async () => {
        initComponentTest(TimePickerComponent);
        fixture = TestBed.createComponent(TimePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('inits correctly', () => {
        expect(component).toBeTruthy();
    });
});
