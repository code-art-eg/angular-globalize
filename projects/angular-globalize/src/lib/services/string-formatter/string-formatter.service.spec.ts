import { TestBed } from '@angular/core/testing';

import { CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY, CANG_LOCALE_PROVIDER, CANG_SUPPORTED_CULTURES } from '../../constants';
import { StorageLocaleProviderService } from '../locale-provider/storage-locale-provider.service';
import { StringFormatterService } from './string-formatter.service';
import { loadGlobalizeData } from '../../../test/globalize-data-loader';

describe('StringFormatterService', () => {
    const cultures = ['en-GB', 'ar-EG', 'de'];
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
            ]
        });
        localStorage.clear();
        loadGlobalizeData();
    });

    it('formats strings without arguments', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test')).toBe('Test');
    });

    it('formats strings with number argument', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0}', 1)).toBe('Test: 1');
    });

    it('formats strings with number arguments', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0} + {1} = {2}', 1, 2, 3)).toBe('Test: 1 + 2 = 3');
    });

    it('formats strings with currency', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0:CUSD3}!', 1.23456)).toBe('Test: US$1.235!');
        expect(service.formatString('Test: {0:cUSD2}!', 1.23456)).toBe('Test: US$1.23!');
        expect(service.formatString('Test: {0:cUSD}!', 1.23456)).toBe('Test: US$1!');
    });

    it('formats strings with integer', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0:d3}!', 1)).toBe('Test: 001!');
        expect(service.formatString('Test: {0:d}!', 1.23456)).toBe('Test: 1.234!');
    });

    it('formats strings with fixed decimals', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0:f3}!', 1)).toBe('Test: 1.000!');
        expect(service.formatString('Test: {0:f3}!', 1.23456)).toBe('Test: 1.235!');
        expect(service.formatString('Test: {0:f3}!', 100000.23456)).toBe('Test: 100000.235!');
    });

    it('formats strings with grouping decimals', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0:n3}!', 1)).toBe('Test: 1.000!');
        expect(service.formatString('Test: {0:N3}!', 1.23456)).toBe('Test: 1.235!');
        expect(service.formatString('Test: {0:N3}!', 100000.23456)).toBe('Test: 100,000.235!');
    });

    it('formats strings with percent', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0:p2}!', 1)).toBe('Test: 100.00%!');
        expect(service.formatString('Test: {0:p}!', 1.23)).toBe('Test: 123%!');
        expect(service.formatString('Test: {0:p}!', 1.234)).toBe('Test: 123%!');
        expect(service.formatString('Test: {0:p2}!', 0.226)).toBe('Test: 22.60%!');
    });

    it('formats strings with hex', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0:x}!', 0x2a)).toBe('Test: 2a!');
        expect(service.formatString('Test: {0:X}!', 0xffb)).toBe('Test: FFB!');
    });

    it('formats null', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0}!', null)).toBe('Test: !');
        expect(service.formatString('Test: {0:X}!', undefined)).toBe('Test: !');
    });

    it('formats strings', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0}!', 'Hello')).toBe('Test: Hello!');
        expect(service.formatString('Test: {0:X}!', 'World')).toBe('Test: World!');
    });

    it('formats booleans', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0}!', true)).toBe('Test: yes!');
        expect(service.formatString('Test: {0:X}!', false)).toBe('Test: no!');
    });

    it('formats dates', () => {
        const service: StringFormatterService = TestBed.inject(StringFormatterService);
        expect(service.formatString('Test: {0}!', new Date(2000, 1, 21))).toBe('Test: 21/02/2000!');
        expect(service.formatString('Test: {0:t}!', new Date(2000, 1, 21))).toBe('Test: 00:00!');
    });
});
