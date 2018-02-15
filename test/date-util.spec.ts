import { expect } from 'chai';
const chai: Chai.ChaiStatic = require('chai');
chai.use(require('chai-datetime'));
import { IGlobalizationService, ICultureService, DefaultGlobalizationService } from '@code-art/angular-globalize';
import { loadedGlobalize } from './load-globalize-data';

import { datesEqual, createDate, similarInUtc, similarInLocal, addDays, isRightToLeft, formatYear, stripTime, minDate, maxDate, dateInRange, numArray, sixArray, sevenArray, twelveArray, getMonthYear } from '../src/util';

describe("Utils datesEqual", () => {

    it("treats null and undefined as equal", () => {
        expect(datesEqual(null, null)).true;
        expect(datesEqual(null, undefined)).true;
        expect(datesEqual(undefined, null)).true;
        expect(datesEqual(undefined, undefined)).true;
    });

    it("treats null and date as not equal", () => {
        expect(datesEqual(null, new Date())).false;
        expect(datesEqual(undefined, new Date())).false;
        expect(datesEqual(new Date(), null)).false;
        expect(datesEqual(new Date(), undefined)).false;
    });

    it("compares 2 dates with same value", () => {
        let d = new Date();
        expect(datesEqual(d, d)).true;
        expect(datesEqual(d, new Date(d.valueOf()))).true;
    });

    it("compares 2 dates with different values", () => {
        let d = new Date();
        let d2 = new Date(d.valueOf() + 1);
        expect(datesEqual(d, d2)).false;
    });

});

describe("Utils createDate", () => {

    it("defaults to today", () => {
        let d = new Date();
        let res = createDate();
        expect(res.getUTCFullYear()).equal(d.getFullYear());
        expect(res.getUTCMonth()).equal(d.getMonth());
        expect(res.getUTCDate()).equal(d.getDate());
        expect(res.getUTCHours()).equal(0);
        expect(res.getUTCMinutes()).equal(0);
        expect(res.getUTCSeconds()).equal(0);
        expect(res.getUTCMilliseconds()).equal(0);
    });

    it("creates utc date", () => {
        let res = createDate(2018, 2, 18);
        expect(res.getUTCFullYear()).equal(2018);
        expect(res.getUTCMonth()).equal(2);
        expect(res.getUTCDate()).equal(18);
        expect(res.getUTCHours()).equal(0);
        expect(res.getUTCMinutes()).equal(0);
        expect(res.getUTCSeconds()).equal(0);
        expect(res.getUTCMilliseconds()).equal(0);
    });

    it("creates utc date before 1000 A.D", () => {
        let res = createDate(800, 2, 18);
        expect(res.getUTCFullYear()).equal(800);
        expect(res.getUTCMonth()).equal(2);
        expect(res.getUTCDate()).equal(18);
        expect(res.getUTCHours()).equal(0);
        expect(res.getUTCMinutes()).equal(0);
        expect(res.getUTCSeconds()).equal(0);
        expect(res.getUTCMilliseconds()).equal(0);


        res = createDate(0, 2, 18);
        expect(res.getUTCFullYear()).equal(0);
        expect(res.getUTCMonth()).equal(2);
        expect(res.getUTCDate()).equal(18);
        expect(res.getUTCHours()).equal(0);
        expect(res.getUTCMinutes()).equal(0);
        expect(res.getUTCSeconds()).equal(0);
        expect(res.getUTCMilliseconds()).equal(0);

        res = createDate(-100, 2, 18);
        expect(res.getUTCFullYear()).equal(-100);
        expect(res.getUTCMonth()).equal(2);
        expect(res.getUTCDate()).equal(18);
        expect(res.getUTCHours()).equal(0);
        expect(res.getUTCMinutes()).equal(0);
        expect(res.getUTCSeconds()).equal(0);
        expect(res.getUTCMilliseconds()).equal(0);
    });
});

describe("Util similarInUtc", () => {
    it("returns null or undefined", () => {
        expect(similarInUtc(null)).null;
        expect(similarInUtc(undefined)).undefined;
    });

    it("returns similalUtc", () => {
        let d = new Date();
        let res = similarInUtc(d);
        expect(res.getUTCFullYear()).equal(d.getFullYear());
        expect(res.getUTCMonth()).equal(d.getMonth());
        expect(res.getUTCDate()).equal(d.getDate());
        expect(res.getUTCHours()).equal(0);
        expect(res.getUTCMinutes()).equal(0);
        expect(res.getUTCSeconds()).equal(0);
        expect(res.getUTCMilliseconds()).equal(0);

        d.setFullYear(1);
        res = similarInUtc(d);
        expect(res.getUTCFullYear()).equal(1);

        d.setFullYear(0);
        res = similarInUtc(d);
        expect(res.getUTCFullYear()).equal(0);

        d.setFullYear(-100);
        res = similarInUtc(d);
        expect(res.getUTCFullYear()).equal(-100);
    });
});

describe("Util similarInLocal", () => {
    it("returns null or undefined", () => {
        expect(similarInLocal(null)).null;
        expect(similarInLocal(undefined)).undefined;
    });

    it("returns similarInLocal", () => {
        let d = new Date();
        let res = similarInLocal(d);
        expect(res.getFullYear()).equal(d.getUTCFullYear());
        expect(res.getMonth()).equal(d.getUTCMonth());
        expect(res.getDate()).equal(d.getUTCDate());
        expect(res.getHours()).equal(0);
        expect(res.getMinutes()).equal(0);
        expect(res.getSeconds()).equal(0);
        expect(res.getMilliseconds()).equal(0);
    });
});

describe("Util addDays", () => {
    it("adds days", () => {
        let d = createDate();
        let d2 = addDays(d, 1);
        expect(d2.valueOf() - d.valueOf()).equal(24 * 3600 * 1000);
    });

    it("subtracts days", () => {
        let d = createDate();
        let d2 = addDays(d, -1);
        expect(d.valueOf() - d2.valueOf()).equal(24 * 3600 * 1000);
    });
});

describe("Util isRightToLeft", () => {
    it("returns true for Arabic", () => {
        expect(isRightToLeft('ar')).true;
        expect(isRightToLeft('Ar')).true;
        expect(isRightToLeft('AR')).true;
        expect(isRightToLeft('AR-EG')).true;
        expect(isRightToLeft('ar-EG')).true;
        expect(isRightToLeft('ar-SA')).true;
        expect(isRightToLeft('Ar-Sa')).true;
    });

    it("returns true for Hebrew", () => {
        expect(isRightToLeft('he')).true;
        expect(isRightToLeft('He')).true;
        expect(isRightToLeft('He')).true;
        expect(isRightToLeft('He-IL')).true;
        expect(isRightToLeft('he-il')).true;
        expect(isRightToLeft('he-Il')).true;
        expect(isRightToLeft('He-IL')).true;
    });

    it("returns false for others", () => {
        expect(isRightToLeft('en')).false;
        expect(isRightToLeft('en-EG')).false;
        expect(isRightToLeft('de')).false;
        expect(isRightToLeft(null)).false;
    });
});

describe("Util formatYear", () => {
    const service = new DefaultGlobalizationService(loadedGlobalize, {
        cultureObservable: null,
        currentCulture: 'en-GB'
    });

    it("formats latin", () => {
        expect(formatYear(service, 2000)).equal('2000');
        expect(formatYear(service, 2000, 'de')).equal('2000');
        expect(formatYear(service, 2000, 'en-GB')).equal('2000');
    });

    it("formats non latin", () => {
        expect(formatYear(service, 2000, 'ar-EG')).equal('٢٠٠٠');
    });

    it("adds trailing zeros ", () => {
        expect(formatYear(service, 200, 'ar-EG')).equal('٠٢٠٠');
        expect(formatYear(service, 200, 'de')).equal('0200');
        expect(formatYear(service, 200, 'en-GB')).equal('0200');
        expect(formatYear(service, 200)).equal('0200');
        expect(formatYear(service, 0, 'ar-EG')).equal('٠٠٠٠');
        expect(formatYear(service, 0, 'de')).equal('0000');
        expect(formatYear(service, 0, 'en-GB')).equal('0000');
        expect(formatYear(service, 0)).equal('0000');
    });
});

describe("Util stripTime", () => {
    it("returns null or undefined", () => {
        expect(stripTime(null)).null;
        expect(stripTime(undefined)).undefined;
    });

    it("returns strip time", () => {
        const d = createDate();
        d.setUTCHours(10);
        d.setUTCMinutes(20);
        d.setUTCSeconds(30);
        d.setUTCMilliseconds(10);
        const res = stripTime(d);
        expect(res.getUTCFullYear()).equal(d.getUTCFullYear());
        expect(res.getUTCMonth()).equal(d.getUTCMonth());
        expect(res.getUTCDate()).equal(d.getUTCDate());
        expect(res.getUTCHours()).equal(0);
        expect(res.getUTCMinutes()).equal(0);
        expect(res.getUTCSeconds()).equal(0);
        expect(res.getUTCMilliseconds()).equal(0);
    });
});

describe("Util minDate and maxDate and range", () => {
    it("returns null or undefined", () => {
        expect(minDate(null, new Date())).null;
        expect(minDate(undefined, new Date())).undefined;
        expect(maxDate(null, new Date())).null;
        expect(maxDate(undefined, new Date())).undefined;

        expect(minDate(null, new Date())).null;
        expect(minDate(undefined, new Date())).undefined;
        expect(maxDate(null, new Date())).null;
        expect(maxDate(undefined, new Date())).undefined;
    });

    it("returns minDate", () => {
        const d = new Date();
        const d1 = new Date(d.valueOf() + 100);
        const d2 = new Date(d.valueOf() + 200);

        expect(minDate(d)).equalTime(d);
        expect(minDate(d, d1, d2)).equalTime(d);
        expect(minDate(d1, d, d2)).equalTime(d);
        expect(minDate(d, d1)).equalTime(d);
        expect(minDate(d2, d1, d)).equalTime(d);
    });

    it("returns maxDate", () => {
        const d = new Date();
        const d1 = new Date(d.valueOf() - 100);
        const d2 = new Date(d.valueOf() - 200);

        expect(maxDate(d)).equalTime(d);
        expect(maxDate(d, d1, d2)).equalTime(d);
        expect(maxDate(d1, d, d2)).equalTime(d);
        expect(maxDate(d, d1)).equalTime(d);
        expect(maxDate(d2, d1, d)).equalTime(d);
    });

    it("checks Range", () => {
        const d = new Date();
        const d1 = new Date(d.valueOf() + 100);
        const d2 = new Date(d.valueOf() + 200);

        expect(dateInRange(d, null, null)).true;
        expect(dateInRange(d, undefined, undefined)).true;
        expect(dateInRange(d, null, undefined)).true;
        expect(dateInRange(d, undefined, null)).true;
        expect(dateInRange(null, null, null)).true;
        expect(dateInRange(null, undefined, undefined)).true;
        expect(dateInRange(null, null, undefined)).true;
        expect(dateInRange(null, undefined, null)).true;
        expect(dateInRange(undefined, null, null)).true;
        expect(dateInRange(undefined, undefined, undefined)).true;
        expect(dateInRange(undefined, null, undefined)).true;
        expect(dateInRange(undefined, undefined, null)).true;

        expect(dateInRange(undefined, d1, d2)).true;
        expect(dateInRange(null, d1, d2)).true;


        expect(dateInRange(d, d2, d1)).false;
        expect(dateInRange(d1, d2, d)).false;
        expect(dateInRange(d1, d, d2)).true;
    });
});

describe("Util numArray", () => {
    it("returns correct length", () => {
        let x = 13;
        let res = numArray(x);
        expect(Array.isArray(res)).true;
        expect(res).lengthOf(x);
        for (let i = 0; i < res.length; i++) {
            expect(res[i]).equal(i);
        }
    });

    it("built in correct lengths", () => {
        expect(Array.isArray(sevenArray)).true;
        expect(Array.isArray(sixArray)).true;
        expect(Array.isArray(twelveArray)).true;

        expect(sevenArray).lengthOf(7);
        expect(sixArray).lengthOf(6);
        expect(twelveArray).lengthOf(12);
    });
});


describe("getMonthYear", () => {
    it("returns null when m === null", () => {
        const [m, y] = getMonthYear(null, 2000);
        expect(m).null;
        expect(y).equal(2000);
    });

    it("returns same values when month in range", () => {
        let [m, y] = getMonthYear(0, 2000);
        expect(m).equal(0);
        expect(y).equal(2000);

        [m, y] = getMonthYear(11, 2000);
        expect(m).equal(11);
        expect(y).equal(2000);

        [m, y] = getMonthYear(7, 2000);
        expect(m).equal(7);
        expect(y).equal(2000);
    });

    it("decreases year when month is negative", () => {
        let [m, y] = getMonthYear(-1, 2000);
        expect(m).equal(11);
        expect(y).equal(1999);

        [m, y] = getMonthYear(-4, 2000);
        expect(m).equal(8);
        expect(y).equal(1999);

        [m, y] = getMonthYear(-13, 2000);
        expect(m).equal(11);
        expect(y).equal(1998);

        [m, y] = getMonthYear(-100, 2000);
        expect(m).equal(8);
        expect(y).equal(1991);
    });

    it("increases year when month is big", () => {
        let [m, y] = getMonthYear(13, 2000);
        expect(m).equal(1);
        expect(y).equal(2001);

        [m, y] = getMonthYear(23, 2000);
        expect(m).equal(11);
        expect(y).equal(2001);

        [m, y] = getMonthYear(100, 2000);
        expect(m).equal(4);
        expect(y).equal(2008);
    });
});