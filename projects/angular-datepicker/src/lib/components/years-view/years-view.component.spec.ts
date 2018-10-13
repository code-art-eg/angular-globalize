import { TestBed, ComponentFixture } from '@angular/core/testing';
import { initComponentTest } from 'projects/angular-datepicker/src/test/init-test-env';
import { NextPreviousComponent } from '../next-prev/next-prev.component';
import { YearsViewComponent } from './years-view.component';
import { formatYear, IMonthYearSelection, KEY_CODE } from '../../util';
import { GlobalizationService } from '@code-art/angular-globalize';


describe('YearsViewComponent', () => {
    let fixture: ComponentFixture<YearsViewComponent>;
    let component: YearsViewComponent;
    let globalizeService: GlobalizationService;
    beforeEach(async () => {
        initComponentTest(NextPreviousComponent, YearsViewComponent);
        fixture = TestBed.createComponent(YearsViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        globalizeService = TestBed.get(GlobalizationService);
    });

    it('inits correctly', () => {
        expect(component.command).not.toBeNull();
        expect(component.focusRange).toBeNull();
        expect(component.handleKeyboardEvents).toBe(false);
    });

    it('calculates ranges correctly in years view', () => {
        component.locale = 'ar-EG';
        component.year = 2018;
        component.numberOfYears = 1;
        expect(component.ranges.length).toBe(12);
        expect(component.nextPrevText).toBe(`${formatYear(globalizeService,
            2010, component.locale)} - ${formatYear(globalizeService, 2019, component.locale)}`);
        for (let i = 0; i < component.ranges.length; i++) {
            expect(component.ranges[i]).toBe(formatYear(globalizeService, 2010 + i, component.locale));
        }
    });

    it('calculates ranges correctly in decades view', () => {
        component.locale = 'de';
        component.year = 2018;
        component.numberOfYears = 10;
        expect(component.ranges.length).toBe(12);
        expect(component.nextPrevText).toBe(`${formatYear(globalizeService,
            2000, component.locale)} - ${formatYear(globalizeService, 2099, component.locale)}`);
        for (let i = 0; i < component.ranges.length; i++) {
            expect(component.ranges[i]).toBe(`${formatYear(globalizeService,
                2000 + i * 10, component.locale)} - ${formatYear(globalizeService, 2000 + (i + 1) * 10 - 1,
                component.locale)}`);
        }
    });

    it('calculates ranges correctly in centuries view', () => {
        component.locale = 'de';
        component.year = 2018;
        component.numberOfYears = 100;
        expect(component.ranges.length).toBe(12);
        expect(component.nextPrevText).toBe(`${formatYear(globalizeService,
            2000, component.locale)} - ${formatYear(globalizeService, 2999, component.locale)}`);
        for (let i = 0; i < component.ranges.length; i++) {
            expect(component.ranges[i]).toBe(`${formatYear(globalizeService,
                2000 + i * 100, component.locale)} - ${formatYear(globalizeService,
                2000 + (i + 1) * 100 - 1, component.locale)}`);
        }
    });

    it('goes home when home button is clicked', () => {
        component.year = 1;
        component.numberOfYears = 10;
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
        component.numberOfYears = 10;
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

    it('increases year next is clicked in year view', () => {
        component.year = 2018;
        component.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('next');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBe(2028);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('decreases year prev is clicked in year view', () => {
        component.year = 2018;
        component.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('prev');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBe(2008);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('increases year next is clicked in decades view', () => {
        component.year = 2018;
        component.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('next');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBe(2118);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('decreases year prev is clicked in year view', () => {
        component.year = 2018;
        component.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('prev');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBe(1918);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('increases year next is clicked in centuries view', () => {
        component.year = 2018;
        component.numberOfYears = 100;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('next');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBe(3018);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('decreases year prev is clicked in centuries view', () => {
        component.year = 2018;
        component.numberOfYears = 100;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('prev');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBe(1018);
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('switches view to decades in years view ', () => {
        component.year = 2018;
        component.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('text');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBeUndefined();
        expect(e.view).toBe('decades');
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('switches view to centuries in decades view ', () => {
        component.year = 2018;
        component.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('text');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBeUndefined();
        expect(e.view).toBe('centuries');
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('stays on centuries in centuries view ', () => {
        component.year = 2018;
        component.numberOfYears = 100;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.onNextPrevClicked('text');
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.year).toBeUndefined();
        expect(e.view).toBe('centuries');
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('disables years in years view ', () => {
        component.year = 2018;
        component.numberOfYears = 1;
        component.maxYear = 2019;
        component.minYear = 2014;
        expect(component.isDisabled(0)).toBe(true);
        expect(component.isDisabled(5)).toBe(false);
        expect(component.isDisabled(9)).toBe(false);
        expect(component.isDisabled(10)).toBe(true);
        expect(component.isDisabled(11)).toBe(true);
    });

    it('disables years in decades view ', () => {
        component.year = 2060;
        component.numberOfYears = 10;
        component.maxYear = 2080;
        component.minYear = 2050;
        expect(component.isDisabled(0)).toBe(true);
        expect(component.isDisabled(5)).toBe(false);
        expect(component.isDisabled(8)).toBe(false);
        expect(component.isDisabled(10)).toBe(true);
        expect(component.isDisabled(11)).toBe(true);
    });

    it('disables years in centuries view ', () => {
        component.year = 2060;
        component.numberOfYears = 10;
        component.maxYear = 2080;
        component.minYear = 2050;
        expect(component.isDisabled(0)).toBe(true);
        expect(component.isDisabled(5)).toBe(false);
        expect(component.isDisabled(8)).toBe(false);
        expect(component.isDisabled(10)).toBe(true);
        expect(component.isDisabled(11)).toBe(true);
    });

    it('selects year in years view ', () => {
        component.year = 2018;
        component.numberOfYears = 1;
        for (let i = 0; i < 12; i++) {
            expect(component.isSelected(i)).toBe(i === 8);
        }
    });

    it('selects year in decades view ', () => {
        component.year = 2018;
        component.numberOfYears = 10;
        for (let i = 0; i < 12; i++) {
            expect(component.isSelected(i)).toBe(i === 1);
        }
    });

    it('selects year in centuries view ', () => {
        component.year = 2018;
        component.numberOfYears = 100;
        for (let i = 0; i < 12; i++) {
            expect(component.isSelected(i)).toBe(i === 0);
        }
    });

    it('returns other in years view', () => {
        component.year = 2018;
        component.numberOfYears = 1;
        for (let i = 0; i < 12; i++) {
            expect(component.isOther(i)).toBe(i >= 10);
        }
    });

    it('returns other in decades view', () => {
        component.year = 2018;
        component.numberOfYears = 10;
        for (let i = 0; i < 12; i++) {
            expect(component.isOther(i)).toBe(i >= 10);
        }
    });

    it('returns other in centuries view', () => {
        component.year = 2018;
        component.numberOfYears = 100;
        for (let i = 0; i < 12; i++) {
            expect(component.isOther(i)).toBe(i >= 10);
        }
    });

    it('returns range false in years view', () => {
        component.year = 2018;
        component.numberOfYears = 1;
        expect(component.isRange()).toBe(false);
    });

    it('returns range false in decades view', () => {
        component.year = 2018;
        component.numberOfYears = 10;
        expect(component.isRange()).toBe(true);
    });

    it('returns range false in centuries view', () => {
        component.year = 2018;
        component.numberOfYears = 100;
        expect(component.isRange()).toBe(true);
    });

    it('does nothing when clicking disabled range', () => {
        component.minYear = 2014;
        component.year = 2018;
        component.maxYear = 2018;
        component.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.rangeClick(0);
        expect(e).toBeNull();
        component.rangeClick(9);
        expect(e).toBeNull();
        component.rangeClick(4);
        expect(e).not.toBeNull();
        sub.unsubscribe();
    });

    it('range click in years view', () => {
        component.minYear = 1;
        component.year = 2018;
        component.maxYear = 9999;
        component.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.rangeClick(0);
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.reset).not.toBe(true);
        expect(e.view).toBe('months');
        expect(e.year).toBe(2010);
        sub.unsubscribe();
    });

    it('range click in decades view', () => {
        component.minYear = 1;
        component.year = 2018;
        component.maxYear = 9999;
        component.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.rangeClick(4);
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.reset).not.toBe(true);
        expect(e.view).toBe('years');
        expect(e.year).toBe(2040);
        sub.unsubscribe();
    });

    it('range click in centuries view', () => {
        component.minYear = 1;
        component.year = 2018;
        component.maxYear = 9999;
        component.numberOfYears = 100;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.rangeClick(6);
        expect(e).toBeTruthy();
        expect(e.month).toBeUndefined();
        expect(e.reset).not.toBe(true);
        expect(e.view).toBe('decades');
        expect(e.year).toBe(2600);
        sub.unsubscribe();
    });

    it('ignores keyboard events when handleKeyboardEvents is false', () => {
        component.minYear = 1;
        component.year = 2018;
        component.maxYear = 9999;
        component.numberOfYears = 1;
        component.handleKeyboardEvents = false;
        expect(component.focusRange).toBeNull();
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        sub.unsubscribe();
    });

    it('handle keyboard enter without focus in years view', () => {
        component.minYear = 1;
        component.year = 2018;
        component.maxYear = 9999;
        component.numberOfYears = 1;
        component.handleKeyboardEvents = true;
        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent);
        expect(component.focusRange).toBeNull();
        expect(e.year).toBe(2018);
        expect(e.view).toBe('months');
        expect(e.month).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('handle keyboard events in years view', () => {
        component.minYear = 1;
        component.year = 2018;
        component.maxYear = 9999;
        component.numberOfYears = 1;
        component.handleKeyboardEvents = true;
        expect(component.focusRange).toBeNull();

        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(8); // 2018
        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(7); // 2017
        component.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(8); // 2018
        component.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(5); // 2015
        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(8); // 2018
        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(11); // 2021
        component.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);
        expect(e).not.toBeNull();
        expect(e.year).toBe(2028);
        expect(e.month).toBeUndefined();
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        expect(component.focusRange).toBe(4); // 2024
        component.year = e.year;
        e = null;
        component.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(1); // 2021
        component.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent);
        expect(e).not.toBeNull();
        expect(component.focusRange).toBe(8); // 2018
        expect(e.month).toBeUndefined();
        expect(e.view).toBeUndefined();
        expect(e.reset).not.toBe(true);
        expect(e.year).toBe(2018);
        component.year = e.year;
        e = null;
        component.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent);
        expect(e).not.toBeNull();
        expect(component.focusRange).toBeNull();
        expect(e.year).toBe(2018);
        expect(e.view).toBe('months');
        expect(e.month).toBeUndefined();
        expect(e.reset).not.toBe(true);
        sub.unsubscribe();
    });

    it('reverses keyboard arrows in right to left locales', () => {
        component.minYear = 1;
        component.year = 2018;
        component.maxYear = 9999;
        component.numberOfYears = 1;
        component.handleKeyboardEvents = true;
        component.locale = 'ar-EG';
        expect(component.focusRange).toBeNull();

        let e: IMonthYearSelection = null;
        const sub = component.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(8); // 2018
        component.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(9); // 2017
        component.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        expect(e).toBeNull();
        expect(component.focusRange).toBe(8); // 2017
        sub.unsubscribe();
    });
});
