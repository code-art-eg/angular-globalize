import { TestBed } from '@angular/core/testing';

import { CurrentCultureService } from './current-culture.service';
import { CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER, CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY } from '../../constants';
import { StorageLocaleProviderService } from '../locale-provider/storage-locale-provider.service';
import { ILocaleProvider } from '../../models';

describe('CurrentCultureService', () => {
    const cultures = ['de', 'ar-EG', 'en-GB'];
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: CANG_SUPPORTED_CULTURES, useValue: cultures,
                },
                {
                    provide: CANG_LOCALE_PROVIDER, useClass: StorageLocaleProviderService, multi: true,
                },
                { provide: CANG_LOCALE_STORAGE_KEY, useValue: CANG_DEFAULT_LOCALE_KEY },
                StorageLocaleProviderService,
            ]
        });
        localStorage.clear();
    });

    it('should be created', () => {
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        expect(service).toBeTruthy();
        expect(service.currentCulture).toBe(cultures[0]);
    });

    it('should set default culture', () => {
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        expect(service.currentCulture).toBe(cultures[0]);
    });

    it('returns right to left', () => {
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        expect(service.isRightToLeft()).toBe(false);
        service.currentCulture = 'de';
        expect(service.isRightToLeft()).toBe(false);
        service.currentCulture = 'ar-EG';
        expect(service.isRightToLeft()).toBe(true);
        expect(service.isRightToLeft('en')).toBe(false);
        expect(service.isRightToLeft('FA-ir')).toBe(true);
        expect(service.isRightToLeft('ur')).toBe(true);
        service.currentCulture = 'en';
        expect(service.isRightToLeft('He-IL')).toBe(true);
        expect(service.isRightToLeft('sYr')).toBe(true);
        expect(service.isRightToLeft('ar-SA')).toBe(true);
    });

    it('uses provider culture', () => {
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        expect(service.currentCulture).toBe(cultures[0]);
        const provider: ILocaleProvider = TestBed.get(StorageLocaleProviderService);
        provider.locale = cultures[1];
        service.currentCulture = '';
        expect(service.currentCulture).toBe(cultures[1]);
        service.currentCulture = cultures[2];
        expect(provider.locale).toBe(cultures[2]);
    });

    it('uses culture parent', () => {
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        service.currentCulture = 'de-AT';
        expect(service.currentCulture).toBe(cultures[0]);
    });

    it('uses culture child', () => {
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        service.currentCulture = 'ar';
        expect(service.currentCulture).toBe(cultures[1]);
    });

    it('uses culture with same parent', () => {
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        service.currentCulture = 'ar-SA';
        expect(service.currentCulture).toBe(cultures[1]);
    });

    it('does not accept unsupported culture', () => {
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        service.currentCulture = 'es';
        expect(service.currentCulture).toBe(cultures[0]);
    });

    it('observable should replay first value', () => {
        const res: string[] = [];
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        const sub = service.cultureObservable.subscribe((v) => res.push(v));
        expect(res.length).toBe(1);
        expect(res[0]).toBe(cultures[0]);
        sub.unsubscribe();
    });

    it('emits only on change', () => {
        const res: string[] = [];
        const service: CurrentCultureService = TestBed.get(CurrentCultureService);
        const sub = service.cultureObservable.subscribe((v) => res.push(v));
        service.currentCulture = 'de';
        service.currentCulture = 'ar';
        service.currentCulture = 'ar-EG';
        service.currentCulture = 'de';

        expect(res.length).toBe(3);
        expect(res[0]).toBe(cultures[0]);
        expect(res[1]).toBe(cultures[1]);
        expect(res[2]).toBe(cultures[0]);
        sub.unsubscribe();
    });
});
