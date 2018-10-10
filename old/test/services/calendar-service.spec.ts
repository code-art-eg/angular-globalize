import { CurrentCultureService, GlobalizationService } from "../../src/module";
import "../services/load-globalize-data";

import { throws } from "assert";
import { expect } from "chai";
import { CldrService } from "../../src/services/cldr.service";

describe("Calendar Service", () => {
    const cultureService = new CurrentCultureService(["en-GB"]);

    const cldrService = new CldrService();
    const service = new GlobalizationService(cldrService, cultureService);
    const calendar = cldrService.getCalendar("en-GB", "Gregorian");

    const englishDayNames = {
        abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        narrow: ["S", "M", "T", "W", "T", "F", "S"],
        short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    };

    const germanDayNames = {
        abbreviated: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        narrow: ["S", "M", "D", "M", "D", "F", "S"],
        short: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
        wide: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    };

    const englishMonthNames = {
        abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        wide: ["January", "February", "March", "April", "May",
            "June", "July", "August", "September", "October", "November", "December"],
    };

    const germanMonthNames = {
        abbreviated: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        wide: ["Januar", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"],
    };

    it("supports only gregorian calendar", () => {
        throws(() => cldrService.getCalendar("de", "hijri"));
        expect(cldrService.getCalendar("de", "Gregorian")).not.null.and.not.undefined;
    });

    it("returns 12 months", () => {
        for (let year = 1800; year <= 2200; year++) {
            expect(calendar.getMonthsInYear(year)).equal(12);
        }
    });

    it("handles leap years", () => {
        expect(calendar.getDaysInMonth(1800, 1)).equal(28, "Year 1800");
        expect(calendar.getDaysInMonth(1801, 1)).equal(28, "Year 1801");
        expect(calendar.getDaysInMonth(1900, 1)).equal(28, "Year 1900");
        expect(calendar.getDaysInMonth(2000, 1)).equal(29, "Year 2000");
        expect(calendar.getDaysInMonth(2004, 1)).equal(29, "Year 2004");
        expect(calendar.getDaysInMonth(2018, 1)).equal(28, "Year 2018");
    });

    it("returns correct number of days", () => {
        expect(calendar.getDaysInMonth(2018, 0)).equal(31);
        expect(calendar.getDaysInMonth(2018, 1)).equal(28);
        expect(calendar.getDaysInMonth(2018, 2)).equal(31);
        expect(calendar.getDaysInMonth(2018, 3)).equal(30);
        expect(calendar.getDaysInMonth(2018, 4)).equal(31);
        expect(calendar.getDaysInMonth(2018, 5)).equal(30);
        expect(calendar.getDaysInMonth(2018, 6)).equal(31);
        expect(calendar.getDaysInMonth(2018, 7)).equal(31);
        expect(calendar.getDaysInMonth(2018, 8)).equal(30);
        expect(calendar.getDaysInMonth(2018, 9)).equal(31);
        expect(calendar.getDaysInMonth(2018, 10)).equal(30);
        expect(calendar.getDaysInMonth(2018, 11)).equal(31);
    });

    it("should fail on incorrect month", () => {
        throws(() => calendar.getDaysInMonth(2000, -1));
        throws(() => calendar.getDaysInMonth(2000, 12));
    });

    it("returns month name", () => {
        for (let i = 0; i < 12; i++) {
            expect(service.getMonthName(i)).equal(englishMonthNames.wide[i]);
            expect(service.getMonthName(i, "de")).equal(germanMonthNames.wide[i]);
            expect(service.getMonthName(i, "de", "abbreviated")).equal(germanMonthNames.abbreviated[i]);
        }
    });

    it("returns day name", () => {
        for (let i = 0; i < 12; i++) {
            expect(service.getDayName(i)).equal(englishDayNames.wide[i]);
            expect(service.getDayName(i, "de")).equal(germanDayNames.wide[i]);
            expect(service.getDayName(i, "de", "abbreviated")).equal(germanDayNames.abbreviated[i]);
        }
    });

    function generateIt(languageName: string,
                        daysOrMonths: "months" | "days",
                        lang: string,
                        type: string,
                        obj: { [key: string]: string[] },
                        method: (...args) => any) {
        it(`returns ${languageName} ${type} ${daysOrMonths} names`, () => {
            const cal = cldrService.getCalendar(lang);
            const names = method.apply(cal, [type]) as string[];
            const correctNames = obj[type];
            expect(Array.isArray(names)).true;
            expect(names).lengthOf(correctNames.length);
            for (let i = 0; i < names.length; i++) {
                expect(names[i]).equal(correctNames[i]);
            }
        });
    }

    generateIt("english", "months", "en-GB", "abbreviated", englishMonthNames, calendar.getMonthNames);
    generateIt("english", "months", "en-GB", "narrow", englishMonthNames, calendar.getMonthNames);
    generateIt("english", "months", "en-GB", "wide", englishMonthNames, calendar.getMonthNames);
    generateIt("german", "months", "de", "abbreviated", germanMonthNames, calendar.getMonthNames);
    generateIt("german", "months", "de", "narrow", germanMonthNames, calendar.getMonthNames);
    generateIt("german", "months", "de", "wide", germanMonthNames, calendar.getMonthNames);

    generateIt("english", "days", "en-GB", "abbreviated", englishDayNames, calendar.getDayNames);
    generateIt("english", "days", "en-GB", "narrow", englishDayNames, calendar.getDayNames);
    generateIt("english", "days", "en-GB", "wide", englishDayNames, calendar.getDayNames);
    generateIt("english", "days", "en-GB", "short", englishDayNames, calendar.getDayNames);
    generateIt("german", "days", "de", "abbreviated", germanDayNames, calendar.getDayNames);
    generateIt("german", "days", "de", "narrow", germanDayNames, calendar.getDayNames);
    generateIt("german", "days", "de", "wide", germanDayNames, calendar.getDayNames);
    generateIt("german", "days", "de", "short", germanDayNames, calendar.getDayNames);
});
