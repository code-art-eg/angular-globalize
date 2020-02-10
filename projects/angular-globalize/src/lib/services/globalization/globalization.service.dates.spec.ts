import { TestBed } from '@angular/core/testing';

import { CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER, CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY } from '../../constants';
import { StorageLocaleProviderService } from '../locale-provider/storage-locale-provider.service';
import { GlobalizationService } from './globalization.service';
import { loadGlobalizeData } from '../../../test/globalize-data-loader';

describe('GlobalizationService:Dates', () => {
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

    it('formats date null or undefined', () => {
        const service: GlobalizationService = TestBed.inject(GlobalizationService);

        expect(service.formatDate(null)).toBe('');
        expect(service.formatDate(undefined)).toBe('');
        expect(service.formatDate(null, { date: 'short' })).toBe('');
        expect(service.formatDate(undefined, { date: 'short' })).toBe('');

        expect(service.formatDate(null, 'de', { date: 'short' })).toBe('');
        expect(service.formatDate(undefined, 'de', { date: 'short' })).toBe('');
    });

    it('formats date using current culture', () => {
        const service: GlobalizationService = TestBed.inject(GlobalizationService);
        const date = new Date(2018, 1, 18, 19, 45, 57);

        expect(service.formatDate(date)).toBe('18/02/2018');
        expect(service.formatDate(date, { date: 'long' })).toBe('18 February 2018');
        expect(service.formatDate(date, { datetime: 'short' })).toBe('18/02/2018, 19:45');
    });

    it('formats date using provided culture', () => {
        const service: GlobalizationService = TestBed.inject(GlobalizationService);
        const date = new Date(2018, 1, 18, 19, 45, 57);

        expect(service.formatDate(date, 'de')).toBe('18.2.2018');
        expect(service.formatDate(date, 'de', { date: 'long' })).toBe('18. Februar 2018');
        expect(service.formatDate(date, 'de', { datetime: 'short' })).toBe('18.02.18, 19:45');
    });

    it('formats date using null culture', () => {
        const service: GlobalizationService = TestBed.inject(GlobalizationService);
        const date = new Date(2018, 1, 18, 19, 45, 57);

        expect(service.formatDate(date, null)).toBe('18/02/2018');
        expect(service.formatDate(date, null, { date: 'long' })).toBe('18 February 2018');
        expect(service.formatDate(date, null, { datetime: 'short' })).toBe('18/02/2018, 19:45');
    });

    it('formats date using null options', () => {
        const service: GlobalizationService = TestBed.inject(GlobalizationService);
        const date = new Date(2018, 1, 18, 19, 45, 57);

        expect(service.formatDate(date, undefined, null)).toBe('18/02/2018');
        expect(service.formatDate(date, 'de', null)).toBe('18.2.2018');
        expect(service.formatDate(date, null, null)).toBe('18/02/2018');
    });

    it('parses date null or undefined', () => {
        const service: GlobalizationService = TestBed.inject(GlobalizationService);
        expect(service.parseDate(null)).toBe(null);
        expect(service.parseDate(undefined)).toBe(null);
        expect(service.parseDate(null, { date: 'short' })).toBe(null);
        expect(service.parseDate(undefined, { date: 'short' })).toBe(null);

        expect(service.parseDate(null, 'de', { date: 'short' })).toBe(null);
        expect(service.parseDate(undefined, 'de', { date: 'short' })).toBe(null);
    });

    it('parses date using current culture', () => {
        const service: GlobalizationService = TestBed.inject(GlobalizationService);
        const date = new Date(2018, 1, 18, 0, 0, 0);

        expect(service.parseDate(service.formatDate(date))).toEqual(date);
        expect(service.parseDate(service.formatDate(date, { date: 'long' }), { date: 'long' })).toEqual(date);
        expect(service.parseDate(service.formatDate(date, { date: 'short' }), { date: 'short' })).toEqual(date);
    });

    it('parses date using provided culture', () => {
        const service: GlobalizationService = TestBed.inject(GlobalizationService);
        const date = new Date(2018, 1, 18, 0, 0, 0);

        expect(service.parseDate(service.formatDate(date, 'de'), 'de')).toEqual(date);
        expect(service.parseDate(service.formatDate(date, 'de',
            { date: 'long' }), 'de', { date: 'long' })).toEqual(date);
        expect(service.parseDate(service.formatDate(date, 'de',
            { date: 'short' }), 'de', { date: 'short' })).toEqual(date);
    });

    it('parses time only date using current culture', () => {
        const service: GlobalizationService = TestBed.inject(GlobalizationService);
        const date = new Date();
        date.setMilliseconds(0);
        expect(service.parseDate(service.formatDate(date, { time: 'long' }), { time: 'long' })).toEqual(date);
        date.setSeconds(0);
        expect(service.parseDate(service.formatDate(date, { time: 'short' }), { time: 'short' })).toEqual(date);
    });
});
