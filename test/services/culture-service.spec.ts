import { doesNotThrow, throws } from "assert";
import { CurrentCultureService, ILocaleProvider } from "../../src/module";

import { expect } from "chai";

describe("Culture Service ", () => {
    const mockLocaleProvider: ILocaleProvider = {
        canWrite: true,
        locale: "en-GB",
    };

    it("fails with null or null cultures", () => {
        throws(() => {
            new CurrentCultureService(null, [mockLocaleProvider]);
        });
        throws(() => {
            new CurrentCultureService([""], [mockLocaleProvider]);
        });
        throws(() => {
            new CurrentCultureService([], [mockLocaleProvider]);
        });
    });

    it("works with null or empty providers", () => {
        doesNotThrow(() => {
            new CurrentCultureService(["en-GB", "de", "ar-EG"], null);
        });
        doesNotThrow(() => {
            new CurrentCultureService(["en-GB", "de", "ar-EG"], []);
        });
    });

    it("returns right to left", () => {
        const service = new CurrentCultureService(["en-GB", "de", "ar-EG"], null);
        expect(service.isRightToLeft()).false;
        service.currentCulture = "de";
        expect(service.isRightToLeft()).false;
        service.currentCulture = "ar-EG";
        expect(service.isRightToLeft()).true;
        expect(service.isRightToLeft("en")).false;
        expect(service.isRightToLeft("FA-ir")).true;
        expect(service.isRightToLeft("ur")).true;
        service.currentCulture = "en";
        expect(service.isRightToLeft("He-IL")).true;
        expect(service.isRightToLeft("sYr")).true;
        expect(service.isRightToLeft("ar-SA")).true;
    });

    it("should fail with null provider", () => {
        throws(() => {
            new CurrentCultureService(["en-GB", "de", "ar-EG"], [null]);
        });
        throws(() => {
            new CurrentCultureService(["en-GB", "de", "ar-EG"], [mockLocaleProvider, null]);
        });
    });

    it("uses provider culture", () => {
        const mock: ILocaleProvider = {
            canWrite: true,
            locale: "DE",
        };
        expect(new CurrentCultureService(["en-gb", "de", "ar-eg"], [mock]).currentCulture).equals("de");
    });

    it("uses culture parent", () => {
        const mock: ILocaleProvider = {
            canWrite: true,
            locale: "de-de",
        };
        expect(new CurrentCultureService(["EN-GB", "DE", "AR-EG"], [mock]).currentCulture).equals("de");
    });

    it("uses culture child", () => {
        const mock: ILocaleProvider = {
            canWrite: true,
            locale: "de",
        };
        expect(new CurrentCultureService(["en-GB", "de-DE", "ar-EG"], [mock]).currentCulture).equals("de-DE");
    });

    it("uses culture with same parent", () => {
        const mock: ILocaleProvider = {
            canWrite: true,
            locale: "ar-SA",
        };
        expect(new CurrentCultureService(["en-GB", "de", "ar-EG"], [mock]).currentCulture).equals("ar-EG");
    });

    it("uses first supported culture", () => {
        const mock: ILocaleProvider = {
            canWrite: true,
            locale: "es",
        };
        expect(new CurrentCultureService(["en-GB", "de", "ar-EG"], [mock]).currentCulture).equals("en-GB");
    });

    it("updates writable provider", () => {
        const mock: ILocaleProvider = {
            canWrite: true,
            locale: "es",
        };
        const service = new CurrentCultureService(["en-GB", "de", "ar-EG"], [mock]);
        service.currentCulture = "de";
        expect(service.currentCulture).equals("de");
        expect(mock.locale).equals("de");
    });

    it("doesn't update readonly provider", () => {
        const mock: ILocaleProvider = {
            canWrite: false,
            locale: "es",
        };
        const service = new CurrentCultureService(["en-GB", "de", "ar-EG"], [mock]);
        service.currentCulture = "de";
        expect(service.currentCulture).equals("de");
        expect(mock.locale).equals("es");
    });

    it("doesn't accept unsupported culture", () => {
        const mock: ILocaleProvider = {
            canWrite: false,
            locale: "es",
        };
        const service = new CurrentCultureService(["en-GB", "de", "ar-EG"], [mock]);
        service.currentCulture = "es";
        expect(service.currentCulture).equals("en-GB");
    });

    it("observable should replay first value", () => {
        const res: string[] = [];
        const service = new CurrentCultureService(["en-GB", "de", "ar-EG"]);
        const sub = service.cultureObservable.subscribe((v) => res.push(v));
        expect(res.length).equal(1);
        expect(res[0]).equal("en-GB");
        sub.unsubscribe();
    });

    it("emits only on change", () => {
        const res: string[] = [];
        const service = new CurrentCultureService(["en-GB", "de", "ar-EG"]);
        const sub = service.cultureObservable.subscribe((v) => res.push(v));
        service.currentCulture = "en";
        service.currentCulture = "ar";
        service.currentCulture = "ar-EG";
        service.currentCulture = "de";

        expect(res.length).equal(3);
        expect(res[0]).equal("en-GB");
        expect(res[1]).equal("ar-EG");
        expect(res[2]).equal("de");
        sub.unsubscribe();
    });
});
