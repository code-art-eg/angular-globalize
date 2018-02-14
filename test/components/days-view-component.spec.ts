import { DaysViewComponent } from '../../src/components/days-view.component';
import { expect } from 'chai';
import { IGlobalizationService, ICultureService, DefaultGlobalizationService } from '@code-art/angular-globalize';
import { loadedGlobalize } from '../load-globalize-data';
import { formatYear, IMonthYearSelection, KEY_CODE, createDate, addDays, dateInRange } from '../../src/util';


describe("DaysViewComponent", () => {
    const globalizeService = new DefaultGlobalizationService(loadedGlobalize, {
        cultureObservable: null, currentCulture: 'en-GB'
    });

    it("initializes correctly", () => {
        const c = new DaysViewComponent(globalizeService);
        expect(c.command).not.null;
        expect(c.dateClicked).not.null;
        expect(c.handleKeyboardEvents).false;
        expect(c.weekStart).equal(0);
    });

    it("it sets ranges correctly", () => {
        const c = new DaysViewComponent(globalizeService);
        c.month = 1; // Feb (starts on Thu)
        c.year = 2018;

        expect(c.startDate).equalTime(createDate(2018, 1, 1));
        expect(c.endDate).equalTime(createDate(2018, 1, 28));
        expect(c.viewStartDate).equalTime(createDate(2018, 0, 28));
        expect(c.endDate).equalTime(createDate(2018, 1, 28));
        expect(c.allDays).lengthOf(42);
        expect(c.nextPrevText).equal("February 2018");
        c.locale = 'de';
        expect(c.nextPrevText).equal("Februar 2018");
        c.locale = 'ar-EG';
        expect(c.nextPrevText).equal("فبراير ٢٠١٨");

        c.minDate = createDate(2018, 1, 4);
        c.maxDate = createDate(2018, 1, 23);
        c.selectionStart = createDate(2018, 1, 10);
        c.selectionEnd = createDate(2018, 1, 20);
        c.highlightDays = 8; // Wednesdays (3)
        c.todayDate = createDate(2018, 1, 14);
        c.todayHighlight = true;

        let d = c.viewStartDate;
        for (let i = 0; i < c.allDays.length; i++) {
            expect(c.allDays[i]).equalTime(addDays(d, i));

            const cls = c.getClasses(c.allDays[i]);
            expect(cls).not.null.and.not.undefined;
            expect(cls['day']).true;
            expect(cls['other']).equal(c.allDays[i].getUTCMonth() !== 1 || undefined, globalizeService.formatDate(c.allDays[i]));
            expect(cls['disabled']).equal(!dateInRange(c.allDays[i], c.minDate, c.maxDate) || undefined, globalizeService.formatDate(c.allDays[i]));
            expect(cls['selection-end']).equal(c.allDays[i].valueOf() === c.selectionEnd.valueOf() || undefined, globalizeService.formatDate(c.allDays[i]));
            expect(cls['selection-start']).equal(c.allDays[i].valueOf() === c.selectionStart.valueOf() || undefined, globalizeService.formatDate(c.allDays[i]));
            expect(cls['selected']).equal(dateInRange(c.allDays[i], c.selectionStart, c.selectionEnd) || undefined, globalizeService.formatDate(c.allDays[i]));
            expect(cls['highlight']).equal(c.allDays[i].getUTCDay() === 3 || undefined, globalizeService.formatDate(c.allDays[i]));
            expect(cls['today']).equal(c.allDays[i].valueOf() === c.todayDate.valueOf() || undefined, globalizeService.formatDate(c.allDays[i]));
            expect(cls['focused']).undefined;
        }

        c.weekStart = 1; // Monday
        expect(c.viewStartDate).equalTime(createDate(2018, 0, 29));
        expect(c.viewEndDate).equalTime(createDate(2018, 2, 11));
    });

    it("it applies todayhightlight", () => {
        const c = new DaysViewComponent(globalizeService);
        c.month = 1; // Feb (starts on Thu)
        c.year = 2018;
        c.todayHighlight = false;
        c.todayDate = createDate(2018, 1, 14);

        let cls = c.getClasses(c.todayDate);
        expect(cls).not.null.and.not.undefined;
        expect(cls['today']).undefined;

        c.todayHighlight = true

        cls = c.getClasses(c.todayDate);
        expect(cls).not.null.and.not.undefined;
        expect(cls['today']).true;
    });

    it("ignores disabled date clicks", () => {
        const c = new DaysViewComponent(globalizeService);
        c.month = 1; // Feb (starts on Thu)
        c.year = 2018;
        c.minDate = createDate(2018, 1, 10);
        c.maxDate = createDate(2018, 1, 12);
        let e: Date = null;
        const sub = c.dateClicked.asObservable().subscribe(d => {
            e = d;
        });
        c.onClick(createDate(2018, 1, 9));
        expect(e).null;
        c.onClick(createDate(2018, 1, 13));
        expect(e).null;
    });

    it("ignores handles date clicks", () => {
        const c = new DaysViewComponent(globalizeService);
        c.month = 1; // Feb (starts on Thu)
        c.year = 2018;
        c.minDate = createDate(2018, 1, 10);
        c.maxDate = createDate(2018, 1, 12);

        let e: Date = null;
        const sub = c.dateClicked.asObservable().subscribe(d => {
            e = d;
        });
        c.onClick(createDate(2018, 1, 11));
        expect(e).equalTime(createDate(2018, 1, 11));
    });

    it("ignores keyboard events when handleKeyboardEvents false", () => {
        const c = new DaysViewComponent(globalizeService);
        c.month = 1; // Feb (starts on Thu)
        c.year = 2018;
        c.minDate = createDate(2018, 1, 10);
        c.maxDate = createDate(2018, 1, 18);
        c.handleKeyboardEvents = false;
        c.todayDate = createDate(2018, 1, 14);

        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        let cls = c.getClasses(c.todayDate);
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).undefined;
    });

    it("handles keyboard events when handleKeyboardEvents true", () => {
        const c = new DaysViewComponent(globalizeService);
        c.month = 1; // Feb (starts on Thu)
        c.year = 2018;
        c.minDate = createDate(2018, 1, 10);
        c.maxDate = createDate(2018, 2, 10);
        c.handleKeyboardEvents = true;
        c.todayDate = createDate(2018, 1, 14);

        let e: IMonthYearSelection = null;
        let d: Date = null;
        let sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        let sub2 = c.dateClicked.asObservable().subscribe(dt => {
            d = dt;
        });

        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        let cls = c.getClasses(c.todayDate);
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
        expect(e).null;
        expect(d).null;

        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        cls = c.getClasses(addDays(c.todayDate, 7)); // 21st
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
        expect(e).null;
        expect(d).null;

        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);

        cls = c.getClasses(addDays(c.todayDate, 6)); // 20th
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
        expect(e).null;
        expect(d).null;

        c.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);

        cls = c.getClasses(addDays(c.todayDate, 7)); // 21st
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
        expect(e).null;
        expect(d).null;

        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        cls = c.getClasses(addDays(c.todayDate, 14)); // 28th
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
        expect(e).null;
        expect(d).null;

        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        cls = c.getClasses(addDays(c.todayDate, 21)); // 7 Mar (still in view)
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
        expect(e).null;
        expect(d).null;

        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);

        expect(d).null;
        expect(e).not.null;
        expect(e.month).equal(2);
        expect(e.year).equal(2018);
        expect(e.reset).not.true;
        expect(e.view).undefined;
        c.month = e.month;
        c.year = e.year;
        cls = c.getClasses(addDays(c.todayDate, 28)); // 14 Mar (next view)
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
        e = null;

        c.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent); // out of range
         cls = c.getClasses(addDays(c.todayDate, 28)); // 14 Mar (next view)
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
        expect(e).null;
        expect(d).null;

        c.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent); // 7 Mar
        cls = c.getClasses(addDays(c.todayDate, 21)); // 14 Mar (next view)
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
        expect(e).null;
        expect(d).null;

        c.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent); // out of range
        expect(e).null;
        expect(d).equalTime(addDays(c.todayDate, 21));

        sub2.unsubscribe();
        sub.unsubscribe();
    });

    it("reverses keyboards in rtl locales", () => {
        const c = new DaysViewComponent(globalizeService);
        c.month = 1; // Feb (starts on Thu)
        c.year = 2018;
        c.minDate = createDate(2018, 1, 10);
        c.maxDate = createDate(2018, 2, 10);
        c.handleKeyboardEvents = true;
        c.todayDate = createDate(2018, 1, 14);
        c.locale = 'ar-EG';

        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);

        let cls = c.getClasses(c.todayDate);
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;

        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        cls = c.getClasses(addDays(c.todayDate, 1));
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;

        c.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        cls = c.getClasses(c.todayDate);
        expect(cls).not.null.and.not.undefined;
        expect(cls['focused']).true;
    });
});