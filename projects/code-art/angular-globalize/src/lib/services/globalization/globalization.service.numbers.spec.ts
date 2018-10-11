import { TestBed } from '@angular/core/testing';

import { CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER, CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY } from '../../constants';
import { StorageLocaleProviderService } from '../locale-provider/storage-locale-provider.service';
import { GlobalizationService } from './globalization.service';
import Cldr from 'cldrjs';
import { loadGlobalizeData } from '../../../test/globalize-data-loader';

describe('GlobalizationService:Numbers', () => {
    const currency = 'USD';
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

    it('formats number null or undefined', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        expect(service.formatNumber(null)).toBe('');
        expect(service.formatNumber(undefined)).toBe('');
        expect(service.formatNumber(null, { style: 'decimal' })).toBe('');
        expect(service.formatNumber(undefined, { style: 'decimal' })).toBe('');

        expect(service.formatNumber(null, 'de', { style: 'decimal' })).toBe('');
        expect(service.formatNumber(undefined, 'de', { style: 'decimal' })).toBe('');
    });

    it('formats number using current culture', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;

        expect(service.formatNumber(num)).toBe('12,345.67');
        expect(service.formatNumber(num, { style: 'decimal', minimumFractionDigits: 3 })).toBe('12,345.670');
        expect(service.formatNumber(num, { style: 'decimal' })).toBe('12,345.67');
    });

    it('formats number using provided culture', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;

        expect(service.formatNumber(num, 'de')).toBe('12.345,67');
        expect(service.formatNumber(num, 'de', { style: 'decimal', minimumFractionDigits: 3 })).toBe('12.345,670');
        expect(service.formatNumber(num, 'de', { style: 'decimal' })).toBe('12.345,67');
    });

    it('formats number using null culture', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;

        expect(service.formatNumber(num, null)).toBe('12,345.67');
        expect(service.formatNumber(num, null, { style: 'decimal', minimumFractionDigits: 3 })).toBe('12,345.670');
        expect(service.formatNumber(num, null, { style: 'decimal' })).toBe('12,345.67');
    });

    it('formats number using null options', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;

        expect(service.formatNumber(num, undefined, null)).toBe('12,345.67');
        expect(service.formatNumber(num, 'de', null)).toBe('12.345,67');
        expect(service.formatNumber(num, null, null)).toBe('12,345.67');
    });

    it('parses number null or undefined', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        expect(service.parseNumber(null)).toBe(null);
        expect(service.parseNumber(undefined)).toBe(null);
        expect(service.parseNumber(null, { style: 'decimal' })).toBe(null);
        expect(service.parseNumber(undefined, { style: 'decimal' })).toBe(null);

        expect(service.parseNumber(null, 'de', { style: 'decimal' })).toBe(null);
        expect(service.parseNumber(undefined, 'de', { style: 'decimal' })).toBe(null);
    });

    it('parses number using current culture', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;

        expect(service.parseNumber(service.formatNumber(num))).toBe(num);
        expect(service.parseNumber(service.formatNumber(num, { style: 'decimal' }), { style: 'decimal' })).toBe(num);
    });

    it('parses number using provided culture', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;

        expect(service.parseNumber(service.formatNumber(num, 'de'), 'de')).toBe(num);
        expect(service.parseNumber(service.formatNumber(num, 'de',
            { style: 'decimal' }), 'de', { style: 'decimal' })).toBe(num);
    });

    it('formats currency null or undefined', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        expect(service.formatCurrency(null, currency)).toBe('');
        expect(service.formatCurrency(undefined, currency)).toBe('');
        expect(service.formatCurrency(null, currency, { style: 'symbol' })).toBe('');
        expect(service.formatCurrency(undefined, currency, { style: 'symbol' })).toBe('');

        expect(service.formatCurrency(null, currency, 'de', { style: 'symbol' })).toBe('');
        expect(service.formatCurrency(undefined, currency, 'de', { style: 'symbol' })).toBe('');
    });

    it('formats currency using current culture', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;
        const cldr = new Cldr('en-GB');
        const symbol = cldr.main(['numbers/currencies', currency, 'symbol']);

        expect(service.formatCurrency(num, currency)).toBe(symbol + '12,345.67');
        expect(service.formatCurrency(num, currency,
            { style: 'symbol', minimumFractionDigits: 3 })).toBe(symbol + '12,345.670');
        expect(service.formatCurrency(num, currency, { style: 'symbol' })).toBe(symbol + '12,345.67');
    });

    it('formats currency using provided culture', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;
        const cldr = new Cldr('de');
        const symbol = cldr.main(['numbers/currencies', currency, 'symbol']);
        const sep = cldr.main(['numbers',
            'currencyFormats-numberSystem-latn', 'currencySpacing', 'afterCurrency']).insertBetween;

        expect(service.formatCurrency(num, currency, 'de')).toBe('12.345,67' + sep + symbol);
        expect(service.formatCurrency(num, currency, 'de',
            { style: 'symbol', minimumFractionDigits: 3 })).toBe('12.345,670' + sep + symbol);
        expect(service.formatCurrency(num, currency, 'de', { style: 'symbol' })).toBe('12.345,67' + sep + symbol);
    });

    it('formats currency using null culture', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;
        const cldr = new Cldr('en-GB');
        const symbol = cldr.main(['numbers/currencies', currency, 'symbol']);

        expect(service.formatCurrency(num, currency, null)).toBe(symbol + '12,345.67');
        expect(service.formatCurrency(num, currency, null,
            { style: 'symbol', minimumFractionDigits: 3 })).toBe(symbol + '12,345.670');
        expect(service.formatCurrency(num, currency, null, { style: 'symbol' })).toBe(symbol + '12,345.67');
    });

    it('formats currency using null options', () => {
        const service: GlobalizationService = TestBed.get(GlobalizationService);
        const num = 12345.67;
        const cldr = new Cldr('en-GB');
        const symbol = cldr.main(['numbers/currencies', currency, 'symbol']);

        expect(service.formatCurrency(num, currency, null, null)).toBe(symbol + '12,345.67');
        expect(service.formatCurrency(num, currency, 'en-GB', null)).toBe(symbol + '12,345.67');
        expect(service.formatCurrency(num, currency, undefined, null)).toBe(symbol + '12,345.67');
    });
});
