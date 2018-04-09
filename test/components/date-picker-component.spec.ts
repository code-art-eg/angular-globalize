import { expect } from "chai";
import { isPlainObject } from "../../src/util";
/* tslint:disable:no-var-requires */
const chai: Chai.ChaiStatic = require("chai");
chai.use(require("chai-datetime"));
/* tslint:enable:no-var-requires */

import {
    CurrentCultureService,
    DefaultGlobalizationService,
    ICultureService,
    IGlobalizationService,
    ILocaleProvider,
    ITypeConverterService,
    TypeConverterService,
} from "@code-art/angular-globalize";
import { addDays, createDate, similarInLocal } from "../../src/util";
import { loadedGlobalize } from "../load-globalize-data";

import { DatePickerComponent } from "../../src/components/date-picker.component";

describe("DatePickerComponent", () => {
    const mockLocaleProvider: ILocaleProvider = {
        canWrite: false,
        locale: "en-GB",
    };

    const cultureService: ICultureService = new CurrentCultureService(["en-GB", "de", "ar-EG"],
        [mockLocaleProvider]);
    const globalizationService: IGlobalizationService =
        new DefaultGlobalizationService(loadedGlobalize, cultureService);
    const typeConverter: ITypeConverterService = new TypeConverterService(globalizationService);

    it("inits correctly", () => {
        const c = new DatePickerComponent(cultureService, typeConverter);
        expect(c.effectiveLocale).equal(mockLocaleProvider.locale);
        expect(c.selectionStart).null;
        expect(c.selectionEnd).null;
        expect(c.rangeSelection).false;
        expect(c.minDate).equalTime(similarInLocal(createDate(0, 0, 1)));
        expect(c.maxDate).equalTime(similarInLocal(createDate(9999, 11, 31)));
        const today = new Date();
        expect(c.todayDate).equalDate(today);
        expect(c.month).equal(today.getMonth());
        expect(c.year).equal(today.getFullYear());

        expect(c.disabled).false;
        expect(c.handleKeyboardEvents).false;
        expect(c.homeButton).true;
        expect(c.resetButton).true;
        expect(c.locale).null;
        expect(c.maxYear).equal(9999);
        expect(c.minYear).equal(0);
        expect(c.todayHighlight).true;
        expect(c.view).equal("days");
    });

    it("switches locale correctly", () => {
        const c = new DatePickerComponent(cultureService, typeConverter);
        expect(c.effectiveLocale).equal(mockLocaleProvider.locale);

        c.locale = "ar-EG";
        expect(c.effectiveLocale).equal("ar-EG");

        c.locale = "de";
        expect(c.effectiveLocale).equal("de");

        c.locale = null;
        expect(c.effectiveLocale).equal(mockLocaleProvider.locale);

        cultureService.currentCulture = "ar-EG";
        expect(c.effectiveLocale).equal("ar-EG");

        c.locale = "de";
        expect(c.effectiveLocale).equal("de");

        cultureService.currentCulture = null;
        expect(c.effectiveLocale).equal("de");
    });

    it("writes values", () => {

        function testWriteValues(component: DatePickerComponent,
                                 val: any, expectedFrom: Date | null,
                                 expectedTo?: Date | null) {
            const date = new Date();
            component.selectionEnd = null;
            component.selectionStart = null;
            component.selectionStart = date;
            component.selectionEnd = date;

            component.writeValue(val);

            if (expectedFrom) {
                expect(component.selectionStart).equalTime(expectedFrom);
            } else {
                expect(component.selectionStart).null;
            }

            if (expectedTo) {
                expect(component.selectionEnd).equalTime(expectedTo);
            } else {
                expect(component.selectionEnd).null;
            }

            if (component.rangeSelection) {
                if (expectedFrom || expectedTo) {
                    expect(component.value).not.null.and.not.undefined;
                    expect(isPlainObject(component.value)).true;
                    if (expectedFrom) {
                        expect(component.value.from).equalTime(expectedFrom);
                    } else {
                        expect(component.value.from).null;
                    }
                    if (expectedTo) {
                        expect(component.value.to).equalTime(expectedTo);
                    } else {
                        expect(component.value.to).null;
                    }
                } else {
                    expect(component.value).null;
                }
            } else if (expectedFrom) {
                expect(component.value).equalTime(expectedFrom);
            } else {
                expect(component.value).null;
            }
        }

        const c = new DatePickerComponent(cultureService, typeConverter);
        const d = new Date(2000, 4, 10);
        testWriteValues(c, null, null);
        testWriteValues(c, undefined, null);
        testWriteValues(c, d, d);

        testWriteValues(c, "bla", null);
        testWriteValues(c, "10/05/2000", d);
        testWriteValues(c, d.valueOf(), d);
        c.locale = "de";
        testWriteValues(c, "10.5.00", d);

        c.rangeSelection = true;
        const d2 = addDays(d, 1);
        testWriteValues(c, [d, d2], d, d2);
        testWriteValues(c, { from: d, to: d2 }, d, d2);
        testWriteValues(c, null, null, null);
        testWriteValues(c, { from: "10.5.00", to: "11.5.00" }, d, d2);
        testWriteValues(c, ["10.5.00", "11.5.00"], d, d2);
    });

    it("raises onchange", () => {
        let raised = false;
        function callback() {
            raised = true;
        }
        const c = new DatePickerComponent(cultureService, typeConverter);

        c.registerOnChange(callback);
        const d = new Date();
        c.selectionStart = d;
        expect(raised).true;
        raised = false;
        c.selectionStart = d;
        expect(raised).false;
        c.selectionEnd = d;
        expect(raised).false;
        c.rangeSelection = true;
        c.selectionEnd = null;
        c.selectionEnd = d;
        expect(raised).true;
        raised = false;
        c.selectionEnd = d;
        expect(raised).false;
    });

    it("raises ontouched", () => {
        let raised = false;
        function callback() {
            raised = true;
        }
        const c = new DatePickerComponent(cultureService, typeConverter);

        c.registerOnTouched(callback);
        c.onDaysViewDayClick(createDate());
        expect(raised).true;
        raised = false;
        c.onCommand({
            view: "months",
        });
        expect(raised).true;
    });

    it("sets disabled ", () => {
        const c = new DatePickerComponent(cultureService, typeConverter);

        c.setDisabledState(true);
        expect(c.disabled).true;
        c.setDisabledState(false);
        expect(c.disabled).false;
    });

    it("sets selection onclick", () => {
        const c = new DatePickerComponent(cultureService, typeConverter);

        const d = createDate();
        c.onDaysViewDayClick(createDate());
        expect(c.selectionStartInternal).equalDate(d);
    });

    it("sets selection range onclick", () => {
        const c = new DatePickerComponent(cultureService, typeConverter);
        c.rangeSelection = true;
        let d = createDate();
        c.onDaysViewDayClick(d);
        expect(c.selectionStartInternal).equalDate(d);

        d = addDays(d, 10);
        c.onDaysViewDayClick(d);
        expect(c.selectionEndInternal).equalDate(d);
    });

    it("handles commands", () => {
        const c = new DatePickerComponent(cultureService, typeConverter);
        c.onCommand({
            month: 10,
        });
        expect(c.month).equals(10);

        c.onCommand({
            year: 2000,
        });
        expect(c.year).equals(2000);

        c.onCommand({
            month: -1,
        });
        expect(c.month).equals(11);
        expect(c.year).equals(1999);

        c.onCommand({
            month: 35,
        });
        expect(c.month).equals(11);
        expect(c.year).equals(2001);

        c.onCommand({
            view: "years",
        });
        expect(c.view).equals("years");

        c.onCommand({
            view: "months",
        });
        expect(c.view).equals("months");

        c.onCommand({
            view: "decades",
        });
        expect(c.view).equals("decades");

        c.onCommand({
            view: "centuries",
        });
        expect(c.view).equals("centuries");

        c.onCommand({
            view: "home",
        });
        expect(c.view).equals("days");
        expect(c.month).equals(c.todayDate.getUTCMonth());
        expect(c.year).equals(c.todayDate.getUTCFullYear());

        c.selectionStart = new Date();
        expect(c.selectionStart).equalDate(c.selectionStart);
        c.onCommand({
            reset: true,
        });
        expect(c.selectionStart).null;
    });
});
