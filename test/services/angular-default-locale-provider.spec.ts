import { AngularDefaultLocaleProvider } from '../../src/module';

import { expect } from 'chai';

describe("Angular Default Locale Provider", () => {
    const testValue = "en-US";
    const service = new AngularDefaultLocaleProvider(testValue);

    it("canWrite should be false", () => {
        expect(service.canWrite).false;
    });

    it("locale should equal testValue", () => {
        expect(service.locale).equals(testValue, "locale should equal value passed in constructor.")
    });
});