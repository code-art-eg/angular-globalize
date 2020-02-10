import { TestBed } from '@angular/core/testing';

import { AngularDefaultLocaleProviderService } from './angular-default-locale-provider.service';
import { LOCALE_ID } from '@angular/core';

describe('AngularDefaultLocaleProviderService', () => {
    const testVal = 'ar-EG';
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            { provide : LOCALE_ID, useValue: testVal },
        ]
    }));

    it('should be created', () => {
        const service: AngularDefaultLocaleProviderService = TestBed.inject(AngularDefaultLocaleProviderService);
        expect(service).toBeTruthy();
    });

    it('can not be written to', () => {
        const service: AngularDefaultLocaleProviderService = TestBed.inject(AngularDefaultLocaleProviderService);
        expect(service.canWrite).toBe(false);
    });

    it('can get a value', () => {
        const service: AngularDefaultLocaleProviderService = TestBed.inject(AngularDefaultLocaleProviderService);
        expect(service.locale).toBe(testVal);
    });
});
