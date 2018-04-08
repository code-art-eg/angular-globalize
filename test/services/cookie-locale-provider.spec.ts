import { CookieLocaleProvider} from "../../src/module";

import { expect } from "chai";

describe("Cookie Locale Provider", () => {
    const testValue = "en-GB";

    it("canWrite should be true", () => {
        const service = new CookieLocaleProvider();
        expect(service.canWrite).true;
    });

    function test(documentMoc: any, testFunc: () => void) {
        const docKey = "document";
        const orig = global[docKey];
        global[docKey] = documentMoc;
        testFunc();
        global[docKey] = orig;
    }

    it("can set and get", () => {
        const mock = {};
        test(mock, () => {
            const service = new CookieLocaleProvider();
            service.locale = testValue;
            expect(service.locale).equals(testValue);
        });
    });

    it("works without dom document undefined", () => {
        test(undefined, () => {
            const service = new CookieLocaleProvider();
            service.locale = testValue;
            expect(service.locale).null;
        });
    });
});
