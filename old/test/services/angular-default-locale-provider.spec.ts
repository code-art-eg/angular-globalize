import { AngularDefaultLocaleProvider } from "../../src/module";

import { expect } from "chai";

describe("Angular Default Locale Provider", () => {
    const testValue = "en-US";
    const service = new AngularDefaultLocaleProvider(testValue);

    it("can't write", () => {
        expect(service.canWrite).equals(false);
    });

    it("returns locale", () => {
        expect(service.locale).equals(testValue, "locale should equal value passed in constructor.");
    });
});
