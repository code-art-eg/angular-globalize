import { TestBed } from '@angular/core/testing';

import { CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER, CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY } from '../../constants';
import { StorageLocaleProviderService } from '../locale-provider/storage-locale-provider.service';
import { throws } from 'assert';
import { CldrService } from './cldr.service';
import { GlobalizationService } from './globalization.service';
import { loadGlobalizeData } from '../../../test/globalize-data-loader';

describe('CalendarService', () => {
    const cultures = ['en-GB', 'ar-EG', 'de'];
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: CANG_SUPPORTED_CULTURES, useValue: cultures,
                },
                {
                    provide: CANG_LOCALE_PROVIDER, useClass: StorageLocaleProviderService, multi: true,
                },
                { provide: CANG_LOCALE_STORAGE_KEY, useValue: CANG_DEFAULT_LOCALE_KEY },
            ]
        });
        localStorage.clear();
        loadGlobalizeData();
    });

    const englishDayNames = {
        abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    };

    const germanDayNames = {
        abbreviated: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        narrow: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
        short: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
        wide: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    };

    const englishMonthNames = {
        abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        wide: ['January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    };

    const germanMonthNames = {
        abbreviated: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        wide: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    };

    it('supports only gregorian calendar', () => {
        const cldrService: CldrService = TestBed.get(CldrService);
        throws(() => cldrService.getCalendar('de', 'hijri'));
        expect(cldrService.getCalendar('de', 'Gregorian')).toBeTruthy();
    });

    it('returns 12 months', () => {
        const cldrService: CldrService = TestBed.get(CldrService);
        const calendar = cldrService.getCalendar('en-GB', 'Gregorian');
        for (let year = 1800; year <= 2200; year++) {
            expect(calendar.getMonthsInYear(year)).toBe(12);
        }
    });

    it('handles leap years', () => {
        const cldrService: CldrService = TestBed.get(CldrService);
        const calendar = cldrService.getCalendar('en-GB', 'Gregorian');

        expect(calendar.getDaysInMonth(1800, 1)).toBe(28, 'Year 1800');
        expect(calendar.getDaysInMonth(1801, 1)).toBe(28, 'Year 1801');
        expect(calendar.getDaysInMonth(1900, 1)).toBe(28, 'Year 1900');
        expect(calendar.getDaysInMonth(2000, 1)).toBe(29, 'Year 2000');
        expect(calendar.getDaysInMonth(2004, 1)).toBe(29, 'Year 2004');
        expect(calendar.getDaysInMonth(2018, 1)).toBe(28, 'Year 2018');
    });

    it('returns correct number of days', () => {
        const cldrService: CldrService = TestBed.get(CldrService);
        const calendar = cldrService.getCalendar('en-GB', 'Gregorian');

        expect(calendar.getDaysInMonth(2018, 0)).toBe(31);
        expect(calendar.getDaysInMonth(2018, 1)).toBe(28);
        expect(calendar.getDaysInMonth(2018, 2)).toBe(31);
        expect(calendar.getDaysInMonth(2018, 3)).toBe(30);
        expect(calendar.getDaysInMonth(2018, 4)).toBe(31);
        expect(calendar.getDaysInMonth(2018, 5)).toBe(30);
        expect(calendar.getDaysInMonth(2018, 6)).toBe(31);
        expect(calendar.getDaysInMonth(2018, 7)).toBe(31);
        expect(calendar.getDaysInMonth(2018, 8)).toBe(30);
        expect(calendar.getDaysInMonth(2018, 9)).toBe(31);
        expect(calendar.getDaysInMonth(2018, 10)).toBe(30);
        expect(calendar.getDaysInMonth(2018, 11)).toBe(31);
    });

    it('should fail on incorrect month', () => {
        const cldrService: CldrService = TestBed.get(CldrService);
        const calendar = cldrService.getCalendar('en-GB', 'Gregorian');

        throws(() => calendar.getDaysInMonth(2000, -1));
        throws(() => calendar.getDaysInMonth(2000, 12));
    });

    it('returns month name', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);

        for (let i = 0; i < 12; i++) {
            expect(service.getMonthName(i)).toBe(englishMonthNames.wide[i]);
            expect(service.getMonthName(i, 'de')).toBe(germanMonthNames.wide[i]);
            expect(service.getMonthName(i, 'de', 'abbreviated')).toBe(germanMonthNames.abbreviated[i]);
        }
    });

    it('returns day name', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        for (let i = 0; i < 12; i++) {
            expect(service.getDayName(i)).toBe(englishDayNames.wide[i]);
            expect(service.getDayName(i, 'de')).toBe(germanDayNames.wide[i]);
            expect(service.getDayName(i, 'de', 'abbreviated')).toBe(germanDayNames.abbreviated[i]);
        }
    });

    function generateIt(languageName: string,
                        daysOrMonths: 'months' | 'days',
                        lang: string,
                        type: string,
                        obj: { [key: string]: string[] },
                        methodName: string) {
        it(`returns ${languageName} ${type} ${daysOrMonths} names`, () => {
            const cldrService: CldrService = TestBed.get(CldrService);

            const cal = cldrService.getCalendar(lang);
            const method: Function = cal[methodName];
            const names = method.apply(cal, [type]) as string[];
            const correctNames = obj[type];
            expect(Array.isArray(names)).toBe(true);
            expect(names.length).toBe(correctNames.length);
            for (let i = 0; i < names.length; i++) {
                expect(names[i]).toBe(correctNames[i]);
            }
        });
    }

    generateIt('english', 'months', 'en-GB', 'abbreviated', englishMonthNames, 'getMonthNames');
    generateIt('english', 'months', 'en-GB', 'narrow', englishMonthNames, 'getMonthNames');
    generateIt('english', 'months', 'en-GB', 'wide', englishMonthNames, 'getMonthNames');
    generateIt('german', 'months', 'de', 'abbreviated', germanMonthNames, 'getMonthNames');
    generateIt('german', 'months', 'de', 'narrow', germanMonthNames, 'getMonthNames');
    generateIt('german', 'months', 'de', 'wide', germanMonthNames, 'getMonthNames');

    generateIt('english', 'days', 'en-GB', 'abbreviated', englishDayNames, 'getDayNames');
    generateIt('english', 'days', 'en-GB', 'narrow', englishDayNames, 'getDayNames');
    generateIt('english', 'days', 'en-GB', 'wide', englishDayNames, 'getDayNames');
    generateIt('english', 'days', 'en-GB', 'short', englishDayNames, 'getDayNames');
    generateIt('german', 'days', 'de', 'abbreviated', germanDayNames, 'getDayNames');
    generateIt('german', 'days', 'de', 'narrow', germanDayNames, 'getDayNames');
    generateIt('german', 'days', 'de', 'wide', germanDayNames, 'getDayNames');
    generateIt('german', 'days', 'de', 'short', germanDayNames, 'getDayNames');
});
