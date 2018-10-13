
import { addDays, createDate, dateInRange, datesEqual, formatYear, getMonthYear,
    isPlainObject, maxDate, minDate, numArray,
    sevenArray, similarInLocal, similarInUtc, sixArray, stripTime, twelveArray } from './util';
import { initComponentTest } from '../test/init-test-env';
import { GlobalizationService } from '@code-art/angular-globalize';
import { TestBed } from '@angular/core/testing';

class Test {
    public v = 3;
}

describe('isPlainObject', () => {
    it ('returns false when not plain object', () => {
        expect(isPlainObject(null)).toBe(false);
        expect(isPlainObject(undefined)).toBe(false);
        expect(isPlainObject(0)).toBe(false);
        expect(isPlainObject(1)).toBe(false);
        expect(isPlainObject(/x/)).toBe(false);
        expect(isPlainObject(new Date())).toBe(false);
        expect(isPlainObject(() => { /* */ })).toBe(false);
        expect(isPlainObject('test')).toBe(false);
        expect(isPlainObject([0])).toBe(false);
        expect(isPlainObject([])).toBe(false);
        expect(isPlainObject(['0'])).toBe(false);
        expect(isPlainObject(true)).toBe(false);
        expect(isPlainObject(false)).toBe(false);
        expect(isPlainObject(new Test())).toBe(false);
    });

    it ('returns true when plain object', () => {
        expect(isPlainObject(Object.create({}))).toBe(true);
        expect(isPlainObject(Object.create(Object.prototype))).toBe(true);
        expect(isPlainObject({x: 1})).toBe(true);
        expect(isPlainObject({})).toBe(true);
    });
});

describe('Utils datesEqual', () => {

    it('treats null and undefined as equal', () => {
        expect(datesEqual(null, null)).toBe(true);
        expect(datesEqual(null, undefined)).toBe(true);
        expect(datesEqual(undefined, null)).toBe(true);
        expect(datesEqual(undefined, undefined)).toBe(true);
    });

    it('treats null and date as not equal', () => {
        expect(datesEqual(null, new Date())).toBe(false);
        expect(datesEqual(undefined, new Date())).toBe(false);
        expect(datesEqual(new Date(), null)).toBe(false);
        expect(datesEqual(new Date(), undefined)).toBe(false);
    });

    it('compares 2 dates with same value', () => {
        const d = new Date();
        expect(datesEqual(d, d)).toBe(true);
        expect(datesEqual(d, new Date(d.valueOf()))).toBe(true);
    });

    it('compares 2 dates with different values', () => {
        const d = new Date();
        const d2 = new Date(d.valueOf() + 1);
        expect(datesEqual(d, d2)).toBe(false);
    });

});

describe('Utils createDate', () => {

    it('defaults to today', () => {
        const d = new Date();
        const res = createDate();
        expect(res.getUTCFullYear()).toBe(d.getFullYear());
        expect(res.getUTCMonth()).toBe(d.getMonth());
        expect(res.getUTCDate()).toBe(d.getDate());
        expect(res.getUTCHours()).toBe(0);
        expect(res.getUTCMinutes()).toBe(0);
        expect(res.getUTCSeconds()).toBe(0);
        expect(res.getUTCMilliseconds()).toBe(0);
    });

    it('creates utc date', () => {
        const res = createDate(2018, 2, 18);
        expect(res.getUTCFullYear()).toBe(2018);
        expect(res.getUTCMonth()).toBe(2);
        expect(res.getUTCDate()).toBe(18);
        expect(res.getUTCHours()).toBe(0);
        expect(res.getUTCMinutes()).toBe(0);
        expect(res.getUTCSeconds()).toBe(0);
        expect(res.getUTCMilliseconds()).toBe(0);
    });

    it('creates utc date before 1000 A.D', () => {
        let res = createDate(800, 2, 18);
        expect(res.getUTCFullYear()).toBe(800);
        expect(res.getUTCMonth()).toBe(2);
        expect(res.getUTCDate()).toBe(18);
        expect(res.getUTCHours()).toBe(0);
        expect(res.getUTCMinutes()).toBe(0);
        expect(res.getUTCSeconds()).toBe(0);
        expect(res.getUTCMilliseconds()).toBe(0);

        res = createDate(0, 2, 18);
        expect(res.getUTCFullYear()).toBe(0);
        expect(res.getUTCMonth()).toBe(2);
        expect(res.getUTCDate()).toBe(18);
        expect(res.getUTCHours()).toBe(0);
        expect(res.getUTCMinutes()).toBe(0);
        expect(res.getUTCSeconds()).toBe(0);
        expect(res.getUTCMilliseconds()).toBe(0);

        res = createDate(-100, 2, 18);
        expect(res.getUTCFullYear()).toBe(-100);
        expect(res.getUTCMonth()).toBe(2);
        expect(res.getUTCDate()).toBe(18);
        expect(res.getUTCHours()).toBe(0);
        expect(res.getUTCMinutes()).toBe(0);
        expect(res.getUTCSeconds()).toBe(0);
        expect(res.getUTCMilliseconds()).toBe(0);
    });
});

describe('Util similarInUtc', () => {
    it('returns null or undefined', () => {
        expect(similarInUtc(null)).toBeNull();
        expect(similarInUtc(undefined)).toBeUndefined();
    });

    it('returns similalUtc', () => {
        const d = new Date();
        let res = similarInUtc(d);
        expect(res.getUTCFullYear()).toBe(d.getFullYear());
        expect(res.getUTCMonth()).toBe(d.getMonth());
        expect(res.getUTCDate()).toBe(d.getDate());
        expect(res.getUTCHours()).toBe(0);
        expect(res.getUTCMinutes()).toBe(0);
        expect(res.getUTCSeconds()).toBe(0);
        expect(res.getUTCMilliseconds()).toBe(0);

        d.setFullYear(1);
        res = similarInUtc(d);
        expect(res.getUTCFullYear()).toBe(1);

        d.setFullYear(0);
        res = similarInUtc(d);
        expect(res.getUTCFullYear()).toBe(0);

        d.setFullYear(-100);
        res = similarInUtc(d);
        expect(res.getUTCFullYear()).toBe(-100);
    });
});

describe('Util similarInLocal', () => {
    it('returns null or undefined', () => {
        expect(similarInLocal(null)).toBeNull();
        expect(similarInLocal(undefined)).toBeUndefined();
    });

    it('returns similarInLocal', () => {
        const d = new Date();
        const res = similarInLocal(d);
        expect(res.getFullYear()).toBe(d.getUTCFullYear());
        expect(res.getMonth()).toBe(d.getUTCMonth());
        expect(res.getDate()).toBe(d.getUTCDate());
        expect(res.getHours()).toBe(0);
        expect(res.getMinutes()).toBe(0);
        expect(res.getSeconds()).toBe(0);
        expect(res.getMilliseconds()).toBe(0);
    });
});

describe('Util addDays', () => {
    it('adds days', () => {
        const d = createDate();
        const d2 = addDays(d, 1);
        expect(d2.valueOf() - d.valueOf()).toBe(24 * 3600 * 1000);
    });

    it('subtracts days', () => {
        const d = createDate();
        const d2 = addDays(d, -1);
        expect(d.valueOf() - d2.valueOf()).toBe(24 * 3600 * 1000);
    });
});

describe('Util formatYear', () => {
    let service: GlobalizationService;
    beforeEach(async () => {
        await initComponentTest();
        service = TestBed.get(GlobalizationService);
    });

    it('formats latin', () => {
        expect(formatYear(service, 2000)).toBe('2000');
        expect(formatYear(service, 2000, 'de')).toBe('2000');
        expect(formatYear(service, 2000, 'en-GB')).toBe('2000');
    });

    it('formats non latin', () => {
        expect(formatYear(service, 2000, 'ar-EG')).toBe('٢٠٠٠');
    });

    it('adds trailing zeros ', () => {
        expect(formatYear(service, 200, 'ar-EG')).toBe('٠٢٠٠');
        expect(formatYear(service, 200, 'de')).toBe('0200');
        expect(formatYear(service, 200, 'en-GB')).toBe('0200');
        expect(formatYear(service, 200)).toBe('0200');
        expect(formatYear(service, 0, 'ar-EG')).toBe('٠٠٠٠');
        expect(formatYear(service, 0, 'de')).toBe('0000');
        expect(formatYear(service, 0, 'en-GB')).toBe('0000');
        expect(formatYear(service, 0)).toBe('0000');
    });
});

describe('Util stripTime', () => {
    it('returns null or undefined', () => {
        expect(stripTime(null)).toBeNull();
        expect(stripTime(undefined)).toBeUndefined();
    });

    it('returns strip time', () => {
        const d = createDate();
        d.setUTCHours(10);
        d.setUTCMinutes(20);
        d.setUTCSeconds(30);
        d.setUTCMilliseconds(10);
        const res = stripTime(d);
        expect(res.getUTCFullYear()).toBe(d.getUTCFullYear());
        expect(res.getUTCMonth()).toBe(d.getUTCMonth());
        expect(res.getUTCDate()).toBe(d.getUTCDate());
        expect(res.getUTCHours()).toBe(0);
        expect(res.getUTCMinutes()).toBe(0);
        expect(res.getUTCSeconds()).toBe(0);
        expect(res.getUTCMilliseconds()).toBe(0);
    });
});

describe('Util minDate and maxDate and range', () => {
    it('returns null or undefined', () => {
        expect(minDate(null, new Date())).toBeNull();
        expect(minDate(undefined, new Date())).toBeUndefined();
        expect(maxDate(null, new Date())).toBeNull();
        expect(maxDate(undefined, new Date())).toBeUndefined();

        expect(minDate(null, new Date())).toBeNull();
        expect(minDate(undefined, new Date())).toBeUndefined();
        expect(maxDate(null, new Date())).toBeNull();
        expect(maxDate(undefined, new Date())).toBeUndefined();
    });

    it('returns minDate', () => {
        const d = new Date();
        const d1 = new Date(d.valueOf() + 100);
        const d2 = new Date(d.valueOf() + 200);

        expect(minDate(d)).toEqual(d);
        expect(minDate(d, d1, d2)).toEqual(d);
        expect(minDate(d1, d, d2)).toEqual(d);
        expect(minDate(d, d1)).toEqual(d);
        expect(minDate(d2, d1, d)).toEqual(d);
    });

    it('returns maxDate', () => {
        const d = new Date();
        const d1 = new Date(d.valueOf() - 100);
        const d2 = new Date(d.valueOf() - 200);

        expect(maxDate(d)).toEqual(d);
        expect(maxDate(d, d1, d2)).toEqual(d);
        expect(maxDate(d1, d, d2)).toEqual(d);
        expect(maxDate(d, d1)).toEqual(d);
        expect(maxDate(d2, d1, d)).toEqual(d);
    });

    it('checks Range', () => {
        const d = new Date();
        const d1 = new Date(d.valueOf() + 100);
        const d2 = new Date(d.valueOf() + 200);

        expect(dateInRange(d, null, null)).toBe(true);
        expect(dateInRange(d, undefined, undefined)).toBe(true);
        expect(dateInRange(d, null, undefined)).toBe(true);
        expect(dateInRange(d, undefined, null)).toBe(true);
        expect(dateInRange(null, null, null)).toBe(true);
        expect(dateInRange(null, undefined, undefined)).toBe(true);
        expect(dateInRange(null, null, undefined)).toBe(true);
        expect(dateInRange(null, undefined, null)).toBe(true);
        expect(dateInRange(undefined, null, null)).toBe(true);
        expect(dateInRange(undefined, undefined, undefined)).toBe(true);
        expect(dateInRange(undefined, null, undefined)).toBe(true);
        expect(dateInRange(undefined, undefined, null)).toBe(true);

        expect(dateInRange(undefined, d1, d2)).toBe(true);
        expect(dateInRange(null, d1, d2)).toBe(true);

        expect(dateInRange(d, d2, d1)).toBe(false);
        expect(dateInRange(d1, d2, d)).toBe(false);
        expect(dateInRange(d1, d, d2)).toBe(true);
    });
});

describe('Util numArray', () => {
    it('returns correct length', () => {
        const x = 13;
        const res = numArray(x);
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(x);
        for (let i = 0; i < res.length; i++) {
            expect(res[i]).toBe(i);
        }
    });

    it('built in correct lengths', () => {
        expect(Array.isArray(sevenArray)).toBe(true);
        expect(Array.isArray(sixArray)).toBe(true);
        expect(Array.isArray(twelveArray)).toBe(true);

        expect(sevenArray.length).toBe(7);
        expect(sixArray.length).toBe(6);
        expect(twelveArray.length).toBe(12);
    });
});

describe('getMonthYear', () => {
    it('returns null when m === null', () => {
        const [m, y] = getMonthYear(null, 2000);
        expect(m).toBeNull();
        expect(y).toBe(2000);
    });

    it('returns same values when month in range', () => {
        let [m, y] = getMonthYear(0, 2000);
        expect(m).toBe(0);
        expect(y).toBe(2000);

        [m, y] = getMonthYear(11, 2000);
        expect(m).toBe(11);
        expect(y).toBe(2000);

        [m, y] = getMonthYear(7, 2000);
        expect(m).toBe(7);
        expect(y).toBe(2000);
    });

    it('decreases year when month is negative', () => {
        let [m, y] = getMonthYear(-1, 2000);
        expect(m).toBe(11);
        expect(y).toBe(1999);

        [m, y] = getMonthYear(-4, 2000);
        expect(m).toBe(8);
        expect(y).toBe(1999);

        [m, y] = getMonthYear(-13, 2000);
        expect(m).toBe(11);
        expect(y).toBe(1998);

        [m, y] = getMonthYear(-100, 2000);
        expect(m).toBe(8);
        expect(y).toBe(1991);
    });

    it('increases year when month is big', () => {
        let [m, y] = getMonthYear(13, 2000);
        expect(m).toBe(1);
        expect(y).toBe(2001);

        [m, y] = getMonthYear(23, 2000);
        expect(m).toBe(11);
        expect(y).toBe(2001);

        [m, y] = getMonthYear(100, 2000);
        expect(m).toBe(4);
        expect(y).toBe(2008);
    });
});
