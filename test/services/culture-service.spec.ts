import { CurrentCultureService, ILocaleProvider } from '../../src/module';
import { throws, doesNotThrow } from 'assert';

import { expect } from 'chai';

describe("Culture Service ", () => {
    const mockLocaleProvider: ILocaleProvider = {
        canWrite: true,
        locale: 'en-GB'
    };

    it("should fail with null or null cultures", () => {
        throws(() => {
            new CurrentCultureService(null, [mockLocaleProvider]);
        });
        throws(() => {
            new CurrentCultureService([''], [mockLocaleProvider]);
        });
        throws(() => {
            new CurrentCultureService([], [mockLocaleProvider]);
        });
    });

    it("should not fail with null or empty providers", () => {
        doesNotThrow(() => {
            new CurrentCultureService(['en-GB', 'de', 'ar-EG'], null);
        });
        doesNotThrow(() => {
            new CurrentCultureService(['en-GB', 'de', 'ar-EG'], []);
        });
    });

    it("should fail with null provider", () => {
        throws(() => {
            new CurrentCultureService(['en-GB', 'de', 'ar-EG'], [null]);
        });
        throws(() => {
            new CurrentCultureService(['en-GB', 'de', 'ar-EG'], [mockLocaleProvider, null]);
        });
    });

    it("should use provider culture", () => {
        let mock: ILocaleProvider = {
            locale: 'DE',
            canWrite: true
        };
        expect(new CurrentCultureService(['en-gb', 'de', 'ar-eg'], [mock]).currentCulture).equals('de');
    });

    it("should use culture parent", () => {
        let mock: ILocaleProvider = {
            locale: 'de-de',
            canWrite: true
        };
        expect(new CurrentCultureService(['EN-GB', 'DE', 'AR-EG'], [mock]).currentCulture).equals('DE');
    });

    it("should use culture child", () => {
        let mock: ILocaleProvider = {
            locale: 'de',
            canWrite: true
        };
        expect(new CurrentCultureService(['en-GB', 'de-DE', 'ar-EG'], [mock]).currentCulture).equals('de-DE');
    });

    it("should use culture with same parent", () => {
        let mock: ILocaleProvider = {
            locale: 'ar-SA',
            canWrite: true
        };
        expect(new CurrentCultureService(['en-GB', 'de', 'ar-EG'], [mock]).currentCulture).equals('ar-EG');
    });


     it("should use first supported culture", () => {
        let mock: ILocaleProvider = {
            locale: 'es',
            canWrite: true
        };
        expect(new CurrentCultureService(['en-GB', 'de', 'ar-EG'], [mock]).currentCulture).equals('en-GB');
    });

    it("should update writable provider", () => {
        let mock: ILocaleProvider = {
            locale: 'es',
            canWrite: true
        };
        const service = new CurrentCultureService(['en-GB', 'de', 'ar-EG'], [mock]);
        service.currentCulture = 'de';
        expect(service.currentCulture).equals('de');
        expect(mock.locale).equals('de');
    });

    it("should not update readonly provider", () => {
        let mock: ILocaleProvider = {
            locale: 'es',
            canWrite: false
        };
        const service = new CurrentCultureService(['en-GB', 'de', 'ar-EG'], [mock]);
        service.currentCulture = 'de';
        expect(service.currentCulture).equals('de');
        expect(mock.locale).equals('es');
    });

    it("should not accept unsupported culture", () => {
        let mock: ILocaleProvider = {
            locale: 'es',
            canWrite: false
        };
        const service = new CurrentCultureService(['en-GB', 'de', 'ar-EG'], [mock]);
        service.currentCulture = 'es';
        expect(service.currentCulture).equals('en-GB');
    });

    it("observable should replay first value", () => {
        const res: string[] = [];
        const service = new CurrentCultureService(['en-GB', 'de', 'ar-EG']);
        const sub = service.cultureObservable.subscribe(v => res.push(v));
        expect(res.length).equal(1);
        expect(res[0]).equal('en-GB');
        sub.unsubscribe();
    });

    it("observable should emit only on change", () => {
        const res: string[] = [];
        const service = new CurrentCultureService(['en-GB', 'de', 'ar-EG']);
        const sub = service.cultureObservable.subscribe(v => res.push(v));
        service.currentCulture = 'en';
        service.currentCulture = 'ar';
        service.currentCulture = 'ar-EG';
        service.currentCulture = 'de';

        expect(res.length).equal(3);
        expect(res[0]).equal('en-GB');
        expect(res[1]).equal('ar-EG');
        expect(res[2]).equal('de');
        sub.unsubscribe();
    });
});
