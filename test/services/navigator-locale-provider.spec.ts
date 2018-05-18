import { NavigatorLanguageLocaleProvider } from "../../src/module";

import { expect } from "chai";

describe("Navigator Locale Provider", () => {
    const service = new NavigatorLanguageLocaleProvider();
    const testValue = "en-GB";
    it("canWrite should be false", () => {
        expect(service.canWrite).false;
    });

    function test(nav: any, testFunc: () => void) {
        const navKey = "navigator";
        const original = global[navKey];
        global[navKey] = nav;
        testFunc();
        global[navKey] = original;
    }

    it("locale should read langauges array", () => {
        test({
            languages: [testValue],
        }, () => expect(service.locale).equals(testValue));
    });

    it("locale should read langauges string", () => {
        test({
            language: testValue,
        }, () => expect(service.locale).equals(testValue));
    });

    it("locale should return null when navigator is not defined", () => {
        test(undefined, () => expect(service.locale).empty);
    });
});
