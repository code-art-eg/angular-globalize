import { TestBed, ComponentFixture } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { NextPreviousComponent } from '../next-prev/next-prev.component';
import { IMonthYearSelection, createDate, KEY_CODE, dateInRange, addDays } from '../../util';
import { DaysViewComponent } from './days-view.component';
import { GlobalizationService } from '@code-art/angular-globalize';


describe('DaysViewComponent', () => {
    let fixture: ComponentFixture<DaysViewComponent>;
    let component: DaysViewComponent;
    let globalizeService: GlobalizationService;
    beforeEach(async () => {
        initComponentTest(NextPreviousComponent, DaysViewComponent);
        fixture = TestBed.createComponent(DaysViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        globalizeService = TestBed.get(GlobalizationService);
    });

    it('initializes correctly', () => {
        expect(component.command).not.toBeNull();
        expect(component.dateClicked).not.toBeNull();
        expect(component.handleKeyboardEvents).toBe(false);
        expect(component.weekStart).toBe(0);
    });

    it('it sets ranges correctly', () => {
        component.month = 1; // Feb (starts on Thu)
        component.year = 2018;

        expect(component.startDate).toEqual(createDate(2018, 1, 1));
        expect(component.endDate).toEqual(createDate(2018, 1, 28));
        expect(component.viewStartDate).toEqual(createDate(2018, 0, 28));
        expect(component.endDate).toEqual(createDate(2018, 1, 28));
        expect(component.allDays.length).toBe(42);
        expect(component.nextPrevText).toBe('February 2018');
        component.locale = 'de';
        expect(component.nextPrevText).toBe('Februar 2018');
        component.locale = 'ar-EG';
        expect(component.nextPrevText).toBe('فبراير ٢٠١٨');

        component.minDate = createDate(2018, 1, 4);
        component.maxDate = createDate(2018, 1, 23);
        component.selectionStart = createDate(2018, 1, 10);
        component.selectionEnd = createDate(2018, 1, 20);
        component.highlightDays = 8; // Wednesdays (3)
        component.todayDate = createDate(2018, 1, 14);
        component.todayHighlight = true;

        const d = component.viewStartDate;
        for (let i = 0; i < component.allDays.length; i++) {
            expect(component.allDays[i]).toEqual(addDays(d, i));

            const cls = component.getClasses(component.allDays[i]);
            expect(cls).toBeTruthy();
            expect(cls.day).toBe(true);
            expect(cls.other).toBe(component.allDays[i].getUTCMonth() !== 1 || undefined,
                globalizeService.formatDate(component.allDays[i]));
            expect(cls.disabled).toBe(!dateInRange(component.allDays[i], component.minDate, component.maxDate) || undefined,
                globalizeService.formatDate(component.allDays[i]));
            expect(cls['selection-end']).toBe(component.allDays[i].valueOf() === component.selectionEnd.valueOf() || undefined,
                globalizeService.formatDate(component.allDays[i]));
            expect(cls['selection-start']).toBe(component.allDays[i].valueOf() === component.selectionStart.valueOf() || undefined,
                globalizeService.formatDate(component.allDays[i]));
            expect(cls.selected).toBe(dateInRange(component.allDays[i], component.selectionStart, component.selectionEnd) || undefined,
                globalizeService.formatDate(component.allDays[i]));
            expect(cls.highlight).toBe(component.allDays[i].getUTCDay() === 3 || undefined,
                globalizeService.formatDate(component.allDays[i]));
            expect(cls.today).toBe(component.allDays[i].valueOf() === component.todayDate.valueOf() || undefined,
                globalizeService.formatDate(component.allDays[i]));
            expect(cls.focused).toBeUndefined();
        }

        component.weekStart = 1; // Monday
        expect(component.viewStartDate).toEqual(createDate(2018, 0, 29));
        expect(component.viewEndDate).toEqual(createDate(2018, 2, 11));
    });

    it('it applies todayhightlight', () => {
        component.month = 1; // Feb (starts on Thu)
        component.year = 2018;
        component.todayHighlight = false;
        component.todayDate = createDate(2018, 1, 14);

        let cls = component.getClasses(component.todayDate);
        expect(cls).toBeTruthy();
        expect(cls.today).toBeUndefined();

        component.todayHighlight = true;

        cls = component.getClasses(component.todayDate);
        expect(cls).toBeTruthy();
        expect(cls.today).toBe(true);
    });

    it('ignores disabled date clicks', () => {
        component.month = 1; // Feb (starts on Thu)
        component.year = 2018;
        component.minDate = createDate(2018, 1, 10);
        component.maxDate = createDate(2018, 1, 12);
        let e: Date = null;
        const sub = component.dateClicked.asObservable().subscribe((d) => {
            e = d;
        });
        component.onClick(createDate(2018, 1, 9));
        expect(e).toBeNull();
        component.onClick(createDate(2018, 1, 13));
        expect(e).toBeNull();
        sub.unsubscribe();
    });

    it('ignores handles date clicks', () => {
        component.month = 1; // Feb (starts on Thu)
        component.year = 2018;
        component.minDate = createDate(2018, 1, 10);
        component.maxDate = createDate(2018, 1, 12);

        let e: Date = null;
        const sub = component.dateClicked.asObservable().subscribe((d) => {
            e = d;
        });
        component.onClick(createDate(2018, 1, 11));
        expect(e).toEqual(createDate(2018, 1, 11));
        sub.unsubscribe();
    });

    it('ignores keyboard events when handleKeyboardEvents false', () => {
        component.month = 1; // Feb (starts on Thu)
        component.year = 2018;
        component.minDate = createDate(2018, 1, 10);
        component.maxDate = createDate(2018, 1, 18);
        component.handleKeyboardEvents = false;
        component.todayDate = createDate(2018, 1, 14);

        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        const cls = component.getClasses(component.todayDate);
        expect(cls).toBeTruthy();
        expect(cls.focused).toBeUndefined();
    });

    it('handles keyboard events when handleKeyboardEvents true', () => {
        component.month = 1; // Feb (starts on Thu)
        component.year = 2018;
        component.minDate = createDate(2018, 1, 10);
        component.maxDate = createDate(2018, 2, 10);
        component.handleKeyboardEvents = true;
        component.todayDate = createDate(2018, 1, 14);

        let e: IMonthYearSelection = null;
        let d: Date = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        const sub2 = component.dateClicked.asObservable().subscribe((dt) => {
            d = dt;
        });

        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        let cls = component.getClasses(component.todayDate);
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
        expect(e).toBeNull();
        expect(d).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        cls = component.getClasses(addDays(component.todayDate, 7)); // 21st
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
        expect(e).toBeNull();
        expect(d).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);

        cls = component.getClasses(addDays(component.todayDate, 6)); // 20th
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
        expect(e).toBeNull();
        expect(d).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);

        cls = component.getClasses(addDays(component.todayDate, 7)); // 21st
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
        expect(e).toBeNull();
        expect(d).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        cls = component.getClasses(addDays(component.todayDate, 14)); // 28th
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
        expect(e).toBeNull();
        expect(d).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        cls = component.getClasses(addDays(component.todayDate, 21)); // 7 Mar (still in view)
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
        expect(e).toBeNull();
        expect(d).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        expect(d).toBeNull();
        expect(e).not.toBeNull();
        expect(e.month).toBe(2);
        expect(e.year).toBe(2018);
        expect(e.reset).not.toBe(true);
        expect(e.view).toBeUndefined();
        component.month = e.month;
        component.year = e.year;
        cls = component.getClasses(addDays(component.todayDate, 28)); // 14 Mar (next view)
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
        e = null;

        component.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent); // out of range
        cls = component.getClasses(addDays(component.todayDate, 28)); // 14 Mar (next view)
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
        expect(e).toBeNull();
        expect(d).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent); // 7 Mar
        cls = component.getClasses(addDays(component.todayDate, 21)); // 14 Mar (next view)
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
        expect(e).toBeNull();
        expect(d).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent); // out of range
        expect(e).toBeNull();
        expect(d).toEqual(addDays(component.todayDate, 21));

        sub2.unsubscribe();
        sub.unsubscribe();
    });

    it('reverses keyboards in rtl locales', () => {
        component.month = 1; // Feb (starts on Thu)
        component.year = 2018;
        component.minDate = createDate(2018, 1, 10);
        component.maxDate = createDate(2018, 2, 10);
        component.handleKeyboardEvents = true;
        component.todayDate = createDate(2018, 1, 14);
        component.locale = 'ar-EG';

        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);

        let cls = component.getClasses(component.todayDate);
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);

        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        cls = component.getClasses(addDays(component.todayDate, 1));
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);

        component.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        cls = component.getClasses(component.todayDate);
        expect(cls).toBeTruthy();
        expect(cls.focused).toBe(true);
    });
});
