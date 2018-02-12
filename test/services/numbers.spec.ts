import { IGlobalizationService, ICultureService, DefaultGlobalizationService } from '../../src/module';
import { loadedGlobalize } from './load-globalize-data';

import { expect } from 'chai';
const Cldr = require('cldrjs');

describe("Globalization number formatting", () => {

    const mockCultureService: ICultureService = {
        currentCulture: 'en-GB',
        cultureObservable: null
    };

    const service = new DefaultGlobalizationService(loadedGlobalize, mockCultureService);
    const currency = 'USD';

    it("should format number null or undefined", () => {
        expect(service.formatNumber(null)).null;
        expect(service.formatNumber(undefined)).undefined;
        expect(service.formatNumber(null, { style: 'decimal' })).null;
        expect(service.formatNumber(undefined, { style: 'decimal' })).undefined;

        expect(service.formatNumber(null, 'de', { style: 'decimal' })).null;
        expect(service.formatNumber(undefined, 'de', { style: 'decimal' })).undefined;
    });

    it("should format number using current culture", () => {
        const num = 12345.67;

        expect(service.formatNumber(num)).equal('12,345.67');
        expect(service.formatNumber(num, { style: 'decimal', minimumFractionDigits: 3 })).equal('12,345.670');
        expect(service.formatNumber(num, { style: 'decimal' })).equal('12,345.67');
    });

    it("should format number using provided culture", () => {
        const num = 12345.67;

        expect(service.formatNumber(num, 'de')).equal('12.345,67');
        expect(service.formatNumber(num, 'de', { style: 'decimal', minimumFractionDigits: 3 })).equal('12.345,670');
        expect(service.formatNumber(num, 'de', { style: 'decimal' })).equal('12.345,67');
    });

    it("should format number using null culture", () => {
        const num = 12345.67;

        expect(service.formatNumber(num, null)).equal('12,345.67');
        expect(service.formatNumber(num, null, { style: 'decimal', minimumFractionDigits: 3 })).equal('12,345.670');
        expect(service.formatNumber(num, null, { style: 'decimal' })).equal('12,345.67');
    });

    it("should format number using null options", () => {
        const num = 12345.67;

        expect(service.formatNumber(num, undefined, null)).equal('12,345.67');
        expect(service.formatNumber(num, 'de', null)).equal('12.345,67');
        expect(service.formatNumber(num, null, null)).equal('12,345.67');
    });

    it("should parse number null or undefined", () => {
        expect(service.parseNumber(null)).null;
        expect(service.parseNumber(undefined)).undefined;
        expect(service.parseNumber(null, { style: 'decimal' })).null;
        expect(service.parseNumber(undefined, { style: 'decimal' })).undefined;

        expect(service.parseNumber(null, 'de', { style: 'decimal' })).null;
        expect(service.parseNumber(undefined, 'de', { style: 'decimal' })).undefined;
    });

    it("should parse number using current culture", () => {
        const num = 12345.67;

        expect(service.parseNumber(service.formatNumber(num))).equal(num);
        expect(service.parseNumber(service.formatNumber(num, { style: 'decimal' }), { style: 'decimal' })).equal(num);
    });

    it("should parse number using provided culture", () => {
        const num = 12345.67;

        expect(service.parseNumber(service.formatNumber(num, 'de'), 'de')).equal(num);
        expect(service.parseNumber(service.formatNumber(num, 'de', { style: 'decimal' }), 'de', { style: 'decimal' })).equal(num);
    });

    it("should format currency null or undefined", () => {
        expect(service.formatCurrency(null, currency)).null;
        expect(service.formatCurrency(undefined, currency)).undefined;
        expect(service.formatCurrency(null, currency, { style: 'symbol' })).null;
        expect(service.formatCurrency(undefined, currency, { style: 'symbol' })).undefined;

        expect(service.formatCurrency(null, currency, 'de', { style: 'symbol' })).null;
        expect(service.formatCurrency(undefined, currency, 'de', { style: 'symbol' })).undefined;
    });

    it("should format currency using current culture", () => {
        const num = 12345.67;
        const cldr = new Cldr('en-GB');
        const symbol = cldr.main(['numbers/currencies', currency, "symbol"]);

        expect(service.formatCurrency(num, currency)).equal(symbol + '12,345.67');
        expect(service.formatCurrency(num, currency, { style: 'symbol', minimumFractionDigits: 3 })).equal(symbol + '12,345.670');
        expect(service.formatCurrency(num, currency, { style: 'symbol' })).equal(symbol + '12,345.67');
    });

    it("should format currency using provided culture", () => {
        const num = 12345.67;
        const cldr = new Cldr('de');
        const symbol = cldr.main(['numbers/currencies', currency, "symbol"]);
        const sep = cldr.main(['numbers', 'currencyFormats-numberSystem-latn', 'currencySpacing', 'afterCurrency']).insertBetween;

        expect(service.formatCurrency(num, currency, 'de')).equal('12.345,67' + sep + symbol);
        expect(service.formatCurrency(num, currency, 'de', { style: 'symbol', minimumFractionDigits: 3 })).equal('12.345,670' + sep + symbol);
        expect(service.formatCurrency(num, currency, 'de', { style: 'symbol' })).equal('12.345,67' + sep + symbol);
    });

    it("should format currency using null culture", () => {
        const num = 12345.67;
        const cldr = new Cldr('en-GB');
        const symbol = cldr.main(['numbers/currencies', currency, "symbol"]);
        const sep = cldr.main(['numbers', 'currencyFormats-numberSystem-latn', 'currencySpacing', 'afterCurrency']).insertBetween;

        expect(service.formatCurrency(num, currency, null)).equal(symbol + '12,345.67');
        expect(service.formatCurrency(num, currency, null, { style: 'symbol', minimumFractionDigits: 3 })).equal(symbol + '12,345.670');
        expect(service.formatCurrency(num, currency, null, { style: 'symbol' })).equal(symbol + '12,345.67');
    });

    it("should format currency using null options", () => {
        const num = 12345.67;
        const cldr = new Cldr('en-GB');
        const symbol = cldr.main(['numbers/currencies', currency, "symbol"]);
        const sep = cldr.main(['numbers', 'currencyFormats-numberSystem-latn', 'currencySpacing', 'afterCurrency']).insertBetween;

        expect(service.formatCurrency(num, currency, null, null)).equal(symbol + '12,345.67');
        expect(service.formatCurrency(num, currency, 'en-GB', null)).equal(symbol + '12,345.67');
        expect(service.formatCurrency(num, currency, undefined, null)).equal(symbol + '12,345.67');
    });
});