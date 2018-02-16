import { IGlobalizationService, ICultureService, DefaultGlobalizationService } from '../../src/module';
import { loadedGlobalize } from './load-globalize-data';

import { expect } from 'chai';
import { throws } from 'assert';

describe("Calendar Service", () => {
    const mockCultureService: ICultureService = {
        currentCulture: 'en-GB',
        cultureObservable: null,
        isRightToLeft: null
    };

    const service = new DefaultGlobalizationService(loadedGlobalize, mockCultureService);
    const englishDayNames = {
        wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    };

    const germanDayNames = {
        wide: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        narrow: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
        abbreviated: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        short: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.']
    };

    const englishMonthNames = {
        wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    };

    const germanMonthNames = {
        wide: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        abbreviated: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    };

    it("supports only gregorian calendar", () => {
        throws(() => service.getCalendar(null, "hijri"));
        expect(service.getCalendar()).not.null.and.not.undefined;
        expect(service.getCalendar(null, "gregorian")).not.null.and.not.undefined;
        expect(service.getCalendar("de", "Gregorian")).not.null.and.not.undefined;
    });

    it("returns 12 months", () => {
        const calendar = service.getCalendar();
        for (let year = 1800; year <= 2200; year++) {
            expect(calendar.getMonthsInYear(year)).equal(12);
        }
    });

    it("handles leap years", () => {
        const calendar = service.getCalendar();
        expect(calendar.getDaysInMonth(1800, 1)).equal(28);
        expect(calendar.getDaysInMonth(1801, 1)).equal(28);
        expect(calendar.getDaysInMonth(1900, 1)).equal(28);
        expect(calendar.getDaysInMonth(2000, 1)).equal(29);
        expect(calendar.getDaysInMonth(2004, 1)).equal(29);
        expect(calendar.getDaysInMonth(2018, 1)).equal(28);
    });

    it("returns correct number of days", () => {
        const calendar = service.getCalendar();
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
        const calendar = service.getCalendar();
        throws(() => calendar.getDaysInMonth(2000, -1));
        throws(() => calendar.getDaysInMonth(2000, 12));
    });

    it("returns month name", () => {
        for (let i = 0; i < 12; i++) {
            expect(service.getMonthName(i)).equal(englishMonthNames.wide[i]);
            expect(service.getMonthName(i, 'de')).equal(germanMonthNames.wide[i]);
            expect(service.getMonthName(i, 'de', 'abbreviated')).equal(germanMonthNames.abbreviated[i]);
        }
    });

    it("returns day name", () => {
        for (let i = 0; i < 12; i++) {
            expect(service.getDayName(i)).equal(englishDayNames.wide[i]);
            expect(service.getDayName(i, 'de')).equal(germanDayNames.wide[i]);
            expect(service.getDayName(i, 'de', 'abbreviated')).equal(germanDayNames.abbreviated[i]);
        }
    });
    
    function generateIt(languageName: string, 
        daysOrMonths: 'months'|'days',
        lang: string | undefined, 
        type: string, 
        obj: { [key: string]: string[] }, 
        method: Function) {
        it(`returns ${languageName} ${type} ${daysOrMonths} names`, () => {
            const calendar = service.getCalendar(lang);
            const names = method.apply(calendar, [type]) as string[];
            const correctNames = obj[type];
            expect(Array.isArray(names)).true;
            expect(names).lengthOf(correctNames.length);
            for (let i = 0; i < names.length; i++) {
                expect(names[i]).equal(correctNames[i]);
            }
        });
    }

    const calendar = service.getCalendar();
    generateIt('english', 'months', undefined, 'abbreviated', englishMonthNames, calendar.getMonthNames);
    generateIt('english', 'months', undefined, 'narrow', englishMonthNames, calendar.getMonthNames);
    generateIt('english', 'months', undefined, 'wide', englishMonthNames, calendar.getMonthNames);
    generateIt('german', 'months', 'de', 'abbreviated', germanMonthNames, calendar.getMonthNames);
    generateIt('german', 'months', 'de', 'narrow', germanMonthNames, calendar.getMonthNames);
    generateIt('german', 'months', 'de', 'wide', germanMonthNames, calendar.getMonthNames);
    
    generateIt('english', 'days', undefined, 'abbreviated', englishDayNames, calendar.getDayNames);
    generateIt('english', 'days', undefined, 'narrow', englishDayNames, calendar.getDayNames);
    generateIt('english', 'days', undefined, 'wide', englishDayNames, calendar.getDayNames);
    generateIt('english', 'days', undefined, 'short', englishDayNames, calendar.getDayNames);
    generateIt('german', 'days', 'de', 'abbreviated', germanDayNames, calendar.getDayNames);
    generateIt('german', 'days', 'de', 'narrow', germanDayNames, calendar.getDayNames);
    generateIt('german', 'days', 'de', 'wide', germanDayNames, calendar.getDayNames);
    generateIt('german', 'days', 'de', 'short', germanDayNames, calendar.getDayNames);
    
});