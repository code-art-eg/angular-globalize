import { TestBed, ComponentFixture } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { MonthsViewComponent } from './months-view.component';
import { NextPreviousComponent } from '../next-prev/next-prev.component';
import { IMonthYearSelection, createDate, KEY_CODE } from '../../util';


describe('MonthsViewComponent', () => {
    let fixture: ComponentFixture<MonthsViewComponent>;
    let component: MonthsViewComponent;
    beforeEach(async () => {
        initComponentTest(NextPreviousComponent, MonthsViewComponent);
        fixture = TestBed.createComponent(MonthsViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('inits correctly', () => {
        expect(component.command).toBeTruthy();
        expect(component.focusMonth).toBeNull();
        expect(component.handleKeyboardEvents).toBe(false);
        expect(Array.isArray(component.months)).toBe(true);
        expect(component.months.length).toBe(12);
        for (let i = 0; i < component.months.length; i++) {
            expect(component.months[i]).toBe(i);
        }
    });

    it('goes home when home button is clicked', () => {
        component.year = 1;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('home');
        expect(e).toBeTruthy();
        expect(e.view).toBe('home');
        expect(e.month).toBeUndefined();
        expect(e.year).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('resets when reset button is clicked', () => {
        component.year = 1;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('reset');
        expect(e).toBeTruthy();
        expect(e.view).toBeUndefined();
        expect(e.month).toBeUndefined();
        expect(e.year).toBeUndefined();
        expect(e.reset).toBe(true);
        sub.unsubscribe();
    });

    it('increases year when next is clicked in year view', () => {
        component.year = 2018;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('next');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBe(2019);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('decreases year when prev is clicked in year view', () => {
        component.year = 2018;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('prev');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBe(2017);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('switches to years view when header is clicked', () => {
        component.year = 2018;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('text');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBeUndefined();
        expect(e.view).toBe('years');
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('sets header year when year or locale are changed', () => {
        component.year = 2000;
        expect(component.nextPrevText).toBe('2000');
        component.locale = 'ar-EG';
        expect(component.nextPrevText).toBe('٢٠٠٠');
        component.year = 1990;
        component.locale = 'de';
        expect(component.nextPrevText).toBe('1990');
    });

    it('disables months and handles month clicks', () => {
        component.year = 2000;
        component.maxDate = createDate(2000, 7, 12);
        component.minDate = createDate(2000, 3, 12);
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        for (let i = 0; i < 12; i++) {
            e = null;
            const disabled = i < 3 || i > 7;
            expect(component.isDisabled(i)).toBe(disabled);
            component.monthClick(i);
            if (disabled) {
                expect(e).toBeNull();
            } else {
                expect(e).not.toBeNull();
                expect(e.month).toBe(i);
                expect(e.view).toBe('days');
                expect(e.year).toBeUndefined();
                expect(e.reset).not.toBe(true);
            }

        }
        sub.unsubscribe();
    });

    it('does not disable in another year', () => {
        component.year = 2000;
        component.maxDate = createDate(1999, 7, 12);
        component.minDate = createDate(2001, 3, 12);
        for (let i = 0; i < 12; i++) {
            expect(component.isDisabled(i)).toBe(true);
        }
    });

    it('ignores keyboard events when handleKeyboardEvents is false', () => {
        component.year = 2018;
        component.month = 0;
        component.handleKeyboardEvents = false;
        expect(component.focusMonth).toBeNull();
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        sub.unsubscribe();
    });

    it('handles keyboard events', () => {
        component.year = 2018;
        component.month = 1;
        component.handleKeyboardEvents = true;
        expect(component.focusMonth).toBeNull();
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(component.focusMonth).toBe(component.month);
        expect(e).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusMonth).toBe(0); // 0

        component.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusMonth).toBe(1); // 0

        component.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent);
        expect(e).not.toBeNull();
        expect(e.year).toBe(2017);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        expect(e.month).toBeUndefined();
        expect(component.focusMonth).toBe(10); // 0
        component.year = e.year;
        e = null;

        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);
        expect(e).not.toBeNull();
        expect(e.year).toBe(2018);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        expect(e.month).toBeUndefined();
        expect(component.focusMonth).toBe(1); // 0
        component.year = e.year;
        e = null;

        component.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent);
        expect(e).not.toBeNull();
        expect(e.month).toBe(1);
        expect(e.view).toBe('days');
        expect(e.year).toBeUndefined();
        expect(e.reset).not.toBe(true);
        expect(component.focusMonth).toBeNull();

        sub.unsubscribe();
    });

    it('reverse keyboard arrows in right to left locales', () => {
        component.year = 2018;
        component.month = 1;
        component.handleKeyboardEvents = true;
        component.locale = 'ar-EG';
        expect(component.focusMonth).toBeNull();
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(component.focusMonth).toBe(component.month);
        expect(e).toBeNull();

        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusMonth).toBe(2); // 0

        component.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusMonth).toBe(1); // 0
        sub.unsubscribe();
    });

    it('handles keyboard enter without focus', () => {
        component.year = 2018;
        component.month = 1;
        component.handleKeyboardEvents = true;
        expect(component.focusMonth).toBeNull();
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent);
        expect(e).not.toBeNull();
        expect(e.month).toBe(1);
        expect(e.view).toBe('days');
        expect(e.year).toBeUndefined();
        expect(e.reset).not.toBe(true);
        expect(component.focusMonth).toBeNull();

        sub.unsubscribe();
    });
});
