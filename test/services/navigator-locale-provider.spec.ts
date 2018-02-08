import { NavigatorLanguageLocaleProvider } from '../../src/module';

import { expect } from 'chai';

describe("Navigator Locale Provider", () => {
    const service = new NavigatorLanguageLocaleProvider();
    const testValue = 'en-GB';
    it("canWrite should be false", () => {
        expect(service.canWrite).false;
    });

    function test(navigator: any, testFunc: () => void) {
        const original = global['navigator'];
        global['navigator'] = navigator;
        testFunc();
        global['navigator'] = original;
    }

    it("locale should read langauges array", () => {
        test({
            'languages': [testValue]
        }, () => expect(service.locale).equals(testValue));
    });

    it("locale should read langauges string", () => {
        test({
            'language': testValue
        }, () => expect(service.locale).equals(testValue));
    });

    it("locale should read browserLanguage", () => {
        test({
            'browserLanguage': testValue
        }, () => expect(service.locale).equals(testValue));
    });

    it("locale should return null when navigator is not defined", () => {
        test(undefined, () => expect(service.locale).null);
    });
});