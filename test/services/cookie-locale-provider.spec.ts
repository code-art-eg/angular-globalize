import { CookieLocaleProvider, CANG_DEFAULT_COOKIE_DURATION_DAYS, CANG_DEFAULT_COOKIE_NAME } from '../../src/module';

import { expect } from 'chai';

describe("Cookie Locale Provider", () => {
    const testValue = 'en-GB';
    
    it("canWrite should be true", () => {
        const service = new CookieLocaleProvider();
        expect(service.canWrite).true;
    });
    
    function test(documentMoc: any, testFunc: () => void) {
        const orig = global['document'];
        global['document'] = documentMoc;
        testFunc();
        global['document'] = orig;
    }

    it("can set and get", () => {
        let mock = {};
        test(mock, () => {
            const service = new CookieLocaleProvider();
            service.locale = testValue;
            expect(service.locale).equals(testValue);
        });
    });

    it("works without dom document undefined", () => {
        let mock = undefined;
        test(mock, () => {
            const service = new CookieLocaleProvider();
            service.locale = testValue;
            expect(service.locale).null;
        });
    });
});