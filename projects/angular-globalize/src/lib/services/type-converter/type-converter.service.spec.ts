import { TestBed } from '@angular/core/testing';

import { CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER, CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY } from '../../constants';
import { StorageLocaleProviderService } from '../locale-provider/storage-locale-provider.service';
import { throws } from 'assert';
import { TypeConverterService } from './type-converter.service';
import { loadGlobalizeData } from '../../../test/globalize-data-loader';

describe('TypeConverterService', () => {
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

    it('converts null to string', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(null)).toBe('');
    });

    it('converts undefined to string', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(undefined)).toBe('');
    });

    it('converts number to string', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(123)).toBe('123');
    });

    it('converts true to string', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(true)).toBe('true');
    });

    it('converts false to string', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(false)).toBe('false');
    });

    it('converts date to string', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(new Date(2018, 1, 18))).toBe('18/02/2018, 00:00');
    });

    it('converts date to string locale', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(new Date(2018, 1, 18), 'de')).toBe('18.02.18, 00:00');
    });

    it('converts string to string', () => {
        const test = 'sss';
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(test)).toBe(test);
    });

    it('converts object to string', () => {
        const obj = {
            toString: (): string => 'x',
        };
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(obj)).toBe('x');
    });

    it('converts null to boolean', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToBoolean(null)).toBe(false);
    });

    it('converts undefined to boolean', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToBoolean(undefined)).toBe(false);
    });

    it('converts zero to boolean', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToBoolean(0)).toBe(false);
    });

    it('converts number to boolean', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToBoolean(-5)).toBe(true);
    });

    it('converts boolean to boolean', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToBoolean(true)).toBe(true);
        expect(typeConverter.convertToBoolean(false)).toBe(false);
    });

    it('converts string to boolean', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToBoolean('False')).toBe(false);
        expect(typeConverter.convertToBoolean('true')).toBe(true);
        expect(typeConverter.convertToBoolean('0')).toBe(false);
        expect(typeConverter.convertToBoolean('1')).toBe(false);
    });

    it('fails to converts object to boolean ', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        throws(() => typeConverter.convertToBoolean(new Date()));
    });

    it('converts null to number', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToNumber(null)).toBe(null);
    });

    it('converts undefined to number', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToNumber(undefined)).toBe(null);
    });

    it('converts false to number', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToNumber(false)).toBe(0);
    });

    it('converts true to number', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToNumber(true)).toBe(1);
    });

    it('converts Date to number', () => {
        const d = new Date();
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToNumber(d)).toBe(d.valueOf());
    });

    it('converts number to number', () => {
        const n = 123;
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToNumber(n)).toBe(n);
    });

    it('converts string to number', () => {
        const n = 123;
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToNumber('123')).toBe(n);
    });

    it('converts string to number locale', () => {
        const n = 123.2;
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToNumber('123,2', 'de')).toBe(n);
    });

    it('converts number to string', () => {
        const n = 123;
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(n)).toBe('123');
    });

    it('converts number to string locale', () => {
        const n = 123.5;
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToString(n, 'de')).toBe('123,5');
    });

    it('fails to converts object to number ', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        throws(() => typeConverter.convertToBoolean({}));
    });

    it('converts null to date', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToDate(null)).toBe(null);
    });

    it('converts undefined to date', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToDate(undefined)).toBe(null);
    });

    it('converts string to date', () => {
        const d1 = new Date(2018, 1, 18, 20, 12);
        const d2 = new Date(2018, 1, 18, 0, 0);
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToDate('18/02/2018, 20:12')).toEqual(d1);
        expect(typeConverter.convertToDate('18/02/2018')).toEqual(d2);
    });

    it('converts string to date locale', () => {
        const d1 = new Date(2018, 1, 18, 20, 12);
        const d2 = new Date(2018, 1, 18, 0, 0);
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToDate('18.02.2018, 20:12:00', 'de')).toEqual(d1);
        expect(typeConverter.convertToDate('18.02.18, 20:12', 'de')).toEqual(d1);
        expect(typeConverter.convertToDate('18.02.2018', 'de')).toEqual(d2);
    });

    it('converts date to date', () => {
        const d = new Date(2018, 1, 18);
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        expect(typeConverter.convertToDate(d)).toEqual(d);
    });

    it('fails to convert object to date', () => {
        const typeConverter: TypeConverterService = TestBed.get(TypeConverterService);
        throws(() => typeConverter.convertToDate({}));
    });
});
