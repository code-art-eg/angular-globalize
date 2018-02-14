import { MonthsViewComponent } from '../../src/components/months-view.component';
import { expect } from 'chai';
import { IGlobalizationService, ICultureService, DefaultGlobalizationService } from '@code-art/angular-globalize';
import { loadedGlobalize } from '../load-globalize-data';
import { IMonthYearSelection, createDate, KEY_CODE } from '../../src/util';

describe("MonthsViewComponent", () => {

    const globalizeService = new DefaultGlobalizationService(loadedGlobalize, {
        cultureObservable: null, currentCulture: 'en-GB'
    });

    it("initializes correctly", () => {
        const c = new MonthsViewComponent(globalizeService);
        expect(c.command).not.null;
        expect(c.focusMonth).null;
        expect(c.handleKeyboardEvents).false;
        expect(Array.isArray(c.months));
        expect(c.months).lengthOf(12);
        for (let i = 0; i < c.months.length; i++) {
            expect(c.months[i]).equal(i);
        }
    });

    it("goes home when home button is clicked", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 1;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        c.onNextPrevClicked('home');
        expect(e).not.null.and.not.undefined;
        expect(e.view).equal('home');
        expect(e.month).undefined;
        expect(e.year).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("resets when reset button is clicked", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 1;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        c.onNextPrevClicked('reset');
        expect(e).not.null.and.not.undefined;
        expect(e.view).undefined;
        expect(e.month).undefined;
        expect(e.year).undefined;
        expect(e.reset).true;
        sub.unsubscribe();
    });

    it("increases year when next is clicked in year view", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2018;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        c.onNextPrevClicked('next');
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).equal(2019);
        expect(e.view).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("decreases year when prev is clicked in year view", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2018;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        c.onNextPrevClicked('prev');
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).equal(2017);
        expect(e.view).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("switches to years view when header is clicked", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2018;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        c.onNextPrevClicked('text');
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).undefined;
        expect(e.view).equal('years');
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("sets header year when year or locale are changed", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2000;
        expect(c.nextPrevText).equal('2000');
        c.locale = 'ar-EG';
        expect(c.nextPrevText).equal('٢٠٠٠');
        c.year = 1990;
        c.locale = 'de';
        expect(c.nextPrevText).equal('1990');
    });

    it("disables months and handles month clicks", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2000;
        c.maxDate = createDate(2000, 7, 12);
        c.minDate = createDate(2000, 3, 12);
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        for (let i = 0; i < 12; i++) {
            e = null;
            const disabled = i < 3 || i > 7;
            expect(c.isDisabled(i)).equal(disabled);
            c.monthClick(i);
            if (disabled) {
                expect(e).null;
            } else {
                expect(e).not.null;
                expect(e.month).equal(i);
                expect(e.view).equal('days');
                expect(e.year).undefined;
                expect(e.reset).not.true;
            }

        }
        sub.unsubscribe();
    });

    it("does not disable in another year", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2000;
        c.maxDate = createDate(1999, 7, 12);
        c.minDate = createDate(2001, 3, 12);
        for (let i = 0; i < 12; i++) {
            expect(c.isDisabled(i)).true;
        }
    });

    it("does not disable in another year", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2000;
        c.maxDate = createDate(1999, 7, 12);
        c.minDate = createDate(2001, 3, 12);
        for (let i = 0; i < 12; i++) {
            expect(c.isDisabled(i)).true;
        }
    });

    it("ignores keyboard events when handleKeyboardEvents is false", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2018;
        c.month = 0;
        c.handleKeyboardEvents = false;
        expect(c.focusMonth).null;
        let e: IMonthYearSelection = null;
        let sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).null;
        sub.unsubscribe();
    });

    it("handles keyboard events", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2018;
        c.month = 1;
        c.handleKeyboardEvents = true;
        expect(c.focusMonth).null;
        let e: IMonthYearSelection = null;
        let sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(c.focusMonth).equal(c.month);
        expect(e).null;

        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusMonth).equal(0); // 0

        c.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusMonth).equal(1); // 0

        c.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent);
        expect(e).not.null;
        expect(e.year).equal(2017);
        expect(e.view).undefined;
        expect(e.reset).not.true;
        expect(e.month).undefined;
        expect(c.focusMonth).equal(10); // 0
        c.year = e.year;
        e = null;

        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);
        expect(e).not.null;
        expect(e.year).equal(2018);
        expect(e.view).undefined;
        expect(e.reset).not.true;
        expect(e.month).undefined;
        expect(c.focusMonth).equal(1); // 0
        c.year = e.year;
        e = null;

        c.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent);
        expect(e).not.null;
        expect(e.month).equal(1);
        expect(e.view).equal('days');
        expect(e.year).undefined;
        expect(e.reset).not.true;
        expect(c.focusMonth).null;

        sub.unsubscribe();
    });

    it("reverse keyboard arrows in right to left locales", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2018;
        c.month = 1;
        c.handleKeyboardEvents = true;
        c.locale = 'ar-EG'
        expect(c.focusMonth).null;
        let e: IMonthYearSelection = null;
        let sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(c.focusMonth).equal(c.month);
        expect(e).null;

        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusMonth).equal(2); // 0

        c.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusMonth).equal(1); // 0
        sub.unsubscribe();
    });


    it("handles keyboard enter without focus", () => {
        const c = new MonthsViewComponent(globalizeService);
        c.year = 2018;
        c.month = 1;
        c.handleKeyboardEvents = true;
        expect(c.focusMonth).null;
        let e: IMonthYearSelection = null;
        let sub = c.command.asObservable().subscribe(ev => {
            e = ev;
        });
        c.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent);
        expect(e).not.null;
        expect(e.month).equal(1);
        expect(e.view).equal('days');
        expect(e.year).undefined;
        expect(e.reset).not.true;
        expect(c.focusMonth).null;

        sub.unsubscribe();
    });
});