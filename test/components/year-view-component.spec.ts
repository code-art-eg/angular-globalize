import { CurrentCultureService, DefaultGlobalizationService} from "@code-art/angular-globalize";
import { expect } from "chai";
import { YearsViewComponent } from "../../src/components/years-view.component";
import { formatYear, IMonthYearSelection, KEY_CODE } from "../../src/util";
import { loadedGlobalize } from "../load-globalize-data";

describe("YearsViewComponent", () => {
    const cultureService = new CurrentCultureService(["en-GB", "ar-EG", "de"]);
    const globalizeService = new DefaultGlobalizationService(loadedGlobalize, cultureService);

    it("initializes correctly", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        expect(c.command).not.null;
        expect(c.focusRange).null;
        expect(c.handleKeyboardEvents).false;
    });

    it("calculates ranges correctly in years view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.locale = "ar-EG";
        c.year = 2018;
        c.numberOfYears = 1;
        expect(c.ranges).lengthOf(12);
        expect(c.nextPrevText).equal(`${formatYear(globalizeService,
            2010, c.locale)} - ${formatYear(globalizeService, 2019, c.locale)}`);
        for (let i = 0; i < c.ranges.length; i++) {
            expect(c.ranges[i]).equal(formatYear(globalizeService, 2010 + i, c.locale));
        }
    });

    it("calculates ranges correctly in decades view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.locale = "de";
        c.year = 2018;
        c.numberOfYears = 10;
        expect(c.ranges).lengthOf(12);
        expect(c.nextPrevText).equal(`${formatYear(globalizeService,
            2000, c.locale)} - ${formatYear(globalizeService, 2099, c.locale)}`);
        for (let i = 0; i < c.ranges.length; i++) {
            expect(c.ranges[i]).equal(`${formatYear(globalizeService,
                2000 + i * 10, c.locale)} - ${formatYear(globalizeService, 2000 + (i + 1) * 10 - 1,
                c.locale)}`);
        }
    });

    it("calculates ranges correctly in centuries view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.locale = "de";
        c.year = 2018;
        c.numberOfYears = 100;
        expect(c.ranges).lengthOf(12);
        expect(c.nextPrevText).equal(`${formatYear(globalizeService,
            2000, c.locale)} - ${formatYear(globalizeService, 2999, c.locale)}`);
        for (let i = 0; i < c.ranges.length; i++) {
            expect(c.ranges[i]).equal(`${formatYear(globalizeService,
                2000 + i * 100, c.locale)} - ${formatYear(globalizeService,
                2000 + (i + 1) * 100 - 1, c.locale)}`);
        }
    });

    it("goes home when home button is clicked", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 1;
        c.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("home");
        expect(e).not.null.and.not.undefined;
        expect(e.view).equal("home");
        expect(e.month).undefined;
        expect(e.year).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("resets when reset button is clicked", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 1;
        c.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("reset");
        expect(e).not.null.and.not.undefined;
        expect(e.view).undefined;
        expect(e.month).undefined;
        expect(e.year).undefined;
        expect(e.reset).true;
        sub.unsubscribe();
    });

    it("increases year next is clicked in year view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("next");
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).equal(2028);
        expect(e.view).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("decreases year prev is clicked in year view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("prev");
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).equal(2008);
        expect(e.view).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("increases year next is clicked in decades view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("next");
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).equal(2118);
        expect(e.view).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("decreases year prev is clicked in year view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("prev");
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).equal(1918);
        expect(e.view).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("increases year next is clicked in centuries view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 100;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("next");
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).equal(3018);
        expect(e.view).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("decreases year prev is clicked in centuries view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 100;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("prev");
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).equal(1018);
        expect(e.view).undefined;
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("switches view to decades in years view ", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("text");
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).undefined;
        expect(e.view).equal("decades");
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("switches view to centuries in decades view ", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("text");
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).undefined;
        expect(e.view).equal("centuries");
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("stays on centuries in centuries view ", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 100;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.onNextPrevClicked("text");
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.year).undefined;
        expect(e.view).equal("centuries");
        expect(e.reset).not.equal(true);
        sub.unsubscribe();
    });

    it("disables years in years view ", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 1;
        c.maxYear = 2019;
        c.minYear = 2014;
        expect(c.isDisabled(0)).true;
        expect(c.isDisabled(5)).false;
        expect(c.isDisabled(9)).false;
        expect(c.isDisabled(10)).true;
        expect(c.isDisabled(11)).true;
    });

    it("disables years in decades view ", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2060;
        c.numberOfYears = 10;
        c.maxYear = 2080;
        c.minYear = 2050;
        expect(c.isDisabled(0)).true;
        expect(c.isDisabled(5)).false;
        expect(c.isDisabled(8)).false;
        expect(c.isDisabled(10)).true;
        expect(c.isDisabled(11)).true;
    });

    it("disables years in centuries view ", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2060;
        c.numberOfYears = 10;
        c.maxYear = 2080;
        c.minYear = 2050;
        expect(c.isDisabled(0)).true;
        expect(c.isDisabled(5)).false;
        expect(c.isDisabled(8)).false;
        expect(c.isDisabled(10)).true;
        expect(c.isDisabled(11)).true;
    });

    it("selects year in years view ", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 1;
        for (let i = 0; i < 12; i++) {
            expect(c.isSelected(i)).equal(i === 8);
        }
    });

    it("selects year in decades view ", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 10;
        for (let i = 0; i < 12; i++) {
            expect(c.isSelected(i)).equal(i === 1);
        }
    });

    it("selects year in centuries view ", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 100;
        for (let i = 0; i < 12; i++) {
            expect(c.isSelected(i)).equal(i === 0);
        }
    });

    it("returns other in years view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 1;
        for (let i = 0; i < 12; i++) {
            expect(c.isOther(i)).equal(i >= 10);
        }
    });

    it("returns other in decades view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 10;
        for (let i = 0; i < 12; i++) {
            expect(c.isOther(i)).equal(i >= 10);
        }
    });

    it("returns other in centuries view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 100;
        for (let i = 0; i < 12; i++) {
            expect(c.isOther(i)).equal(i >= 10);
        }
    });

    it("returns range false in years view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 1;
        expect(c.isRange()).false;
    });

    it("returns range false in decades view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 10;
        expect(c.isRange()).true;
    });

    it("returns range false in centuries view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.year = 2018;
        c.numberOfYears = 100;
        expect(c.isRange()).true;
    });

    it("does nothing when clicking disabled range", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.minYear = 2014;
        c.year = 2018;
        c.maxYear = 2018;
        c.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.rangeClick(0);
        expect(e).null;
        c.rangeClick(9);
        expect(e).null;
        c.rangeClick(4);
        expect(e).not.null;
        sub.unsubscribe();
    });

    it("range click in years view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.minYear = 1;
        c.year = 2018;
        c.maxYear = 9999;
        c.numberOfYears = 1;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.rangeClick(0);
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.reset).not.true;
        expect(e.view).equal("months");
        expect(e.year).equal(2010);
        sub.unsubscribe();
    });

    it("range click in decades view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.minYear = 1;
        c.year = 2018;
        c.maxYear = 9999;
        c.numberOfYears = 10;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.rangeClick(4);
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.reset).not.true;
        expect(e.view).equal("years");
        expect(e.year).equal(2040);
        sub.unsubscribe();
    });

    it("range click in centuries view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.minYear = 1;
        c.year = 2018;
        c.maxYear = 9999;
        c.numberOfYears = 100;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.rangeClick(6);
        expect(e).not.null.and.not.undefined;
        expect(e.month).undefined;
        expect(e.reset).not.true;
        expect(e.view).equal("decades");
        expect(e.year).equal(2600);
        sub.unsubscribe();
    });

    it("ignores keyboard events when handleKeyboardEvents is false", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.minYear = 1;
        c.year = 2018;
        c.maxYear = 9999;
        c.numberOfYears = 1;
        c.handleKeyboardEvents = false;
        expect(c.focusRange).null;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).null;
        sub.unsubscribe();
    });

    it("handle keyboard enter without focus in years view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.minYear = 1;
        c.year = 2018;
        c.maxYear = 9999;
        c.numberOfYears = 1;
        c.handleKeyboardEvents = true;
        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent);
        expect(c.focusRange).null;
        expect(e.year).equal(2018);
        expect(e.view).equal("months");
        expect(e.month).undefined;
        expect(e.reset).not.true;
        sub.unsubscribe();
    });

    it("handle keyboard events in years view", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.minYear = 1;
        c.year = 2018;
        c.maxYear = 9999;
        c.numberOfYears = 1;
        c.handleKeyboardEvents = true;
        expect(c.focusRange).null;

        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(8); // 2018
        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(7); // 2017
        c.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(8); // 2018
        c.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(5); // 2015
        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(8); // 2018
        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(11); // 2021
        c.keyEvent({ keyCode: KEY_CODE.DOWN_ARROW } as KeyboardEvent);
        expect(e).not.null;
        expect(e.year).equal(2028);
        expect(e.month).undefined;
        expect(e.view).undefined;
        expect(e.reset).not.true;
        expect(c.focusRange).equal(4); // 2024
        c.year = e.year;
        e = null;
        c.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(1); // 2021
        c.keyEvent({ keyCode: KEY_CODE.UP_ARROW } as KeyboardEvent);
        expect(e).not.null;
        expect(c.focusRange).equal(8); // 2018
        expect(e.month).undefined;
        expect(e.view).undefined;
        expect(e.reset).not.true;
        expect(e.year).equal(2018);
        c.year = e.year;
        e = null;
        c.keyEvent({ keyCode: KEY_CODE.ENTER } as KeyboardEvent);
        expect(e).not.null;
        expect(c.focusRange).null;
        expect(e.year).equal(2018);
        expect(e.view).equal("months");
        expect(e.month).undefined;
        expect(e.reset).not.true;
        sub.unsubscribe();
    });

    it("reverses keyboard arrows in right to left locales", () => {
        const c = new YearsViewComponent(cultureService, globalizeService);
        c.minYear = 1;
        c.year = 2018;
        c.maxYear = 9999;
        c.numberOfYears = 1;
        c.handleKeyboardEvents = true;
        c.locale = "ar-EG";
        expect(c.focusRange).null;

        let e: IMonthYearSelection = null;
        const sub = c.command.asObservable().subscribe((ev) => {
            e = ev;
        });
        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(8); // 2018
        c.keyEvent({ keyCode: KEY_CODE.LEFT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(9); // 2017
        c.keyEvent({ keyCode: KEY_CODE.RIGHT_ARROW } as KeyboardEvent);
        expect(e).null;
        expect(c.focusRange).equal(8); // 2017
        sub.unsubscribe();
    });
});
