import { TestBed } from '@angular/core/testing';

import { CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER, CANG_LOCALE_STORAGE_KEY, CANG_DEFAULT_LOCALE_KEY } from '../../constants';
import { StorageLocaleProviderService } from '../locale-provider/storage-locale-provider.service';
import { GlobalizationService, parseDuration } from './globalization.service';
import { loadGlobalizeData } from '../../../test/globalize-data-loader';

describe('GlobalizationService:Duration', () => {
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

  it('formats duration null or undefined', () => {
    const service: GlobalizationService = TestBed.inject(GlobalizationService);
    expect(service.formatDuration(null)).toBe('');
    expect(service.formatDuration(undefined)).toBe('');
    expect(service.formatDuration(null, { style: 'constant' })).toBe('');
    expect(service.formatDuration(undefined, { style: 'constant' })).toBe('');

    expect(service.formatDuration(null, 'de', { style: 'constant' })).toBe('');
    expect(service.formatDuration(undefined, 'de', { style: 'constant' })).toBe('');
  });

  it('formats full duration using current culture', () => {
    const service: GlobalizationService = TestBed.inject(GlobalizationService);
    const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
    const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
    const num = date2.valueOf() - date1.valueOf();

    expect(service.formatDuration(num)).toBe('1:8:40:50.06');
    expect(service.formatDuration(num, { style: 'constant' })).toBe('1:08:40:50.060');
    expect(service.formatDuration(num, { style: 'long' })).toBe('1:08:40:50.060');
    expect(service.formatDuration(num, { style: 'racing' })).toBe('1:8:40:50.060');
  });

  it('formats short duration using current culture', () => {
    const service: GlobalizationService = TestBed.inject(GlobalizationService);
    const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
    const date2 = new Date(2000, 0, 1, 0, 40, 50, 60);
    const num = date2.valueOf() - date1.valueOf();

    expect(service.formatDuration(num)).toBe('0:40:50.06');
    expect(service.formatDuration(num, { style: 'constant' })).toBe('0:00:40:50.060');
    expect(service.formatDuration(num, { style: 'long' })).toBe('00:40:50.060');
    expect(service.formatDuration(num, { style: 'racing' })).toBe('40:50.060');
  });

  it('formats negative duration using current culture', () => {
    const service: GlobalizationService = TestBed.inject(GlobalizationService);
    const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
    const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
    const num = date1.valueOf() - date2.valueOf();

    expect(service.formatDuration(num)).toBe('-1:8:40:50.06');
    expect(service.formatDuration(num, { style: 'constant' })).toBe('-1:08:40:50.060');
    expect(service.formatDuration(num, { style: 'long' })).toBe('-1:08:40:50.060');
  });

  it('formats negative duration with pattern', () => {
    const service: GlobalizationService = TestBed.inject(GlobalizationService);
    const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
    const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
    const num = date1.valueOf() - date2.valueOf();

    expect(service.formatDuration(num, { pattern: '[-]hh\\ mm' })).toBe('-08 40');
    expect(service.formatDuration(num, { pattern: 'ss' })).toBe('50');
    expect(service.formatDuration(num, { pattern: '"aa"' })).toBe('aa');
  });

  it('Parses zero duration', () => {
    expect(parseDuration('0.00:00:00.0000000')).toBe(0);
    expect(parseDuration('00:00:00.0000000')).toBe(0);
    expect(parseDuration('00:00:00')).toBe(0);
    expect(parseDuration('00:00:00.000')).toBe(0);
  });

  it('Parses non-zero duration', () => {
    expect(parseDuration('1.00:00:00.0010000')).toBe(8640001);
    expect(parseDuration('10:00:00.1000000')).toBe(36000100);
    expect(parseDuration('10:00:00')).toBe(36000000);
    expect(parseDuration('10:00:00.010')).toBe(36000010);
    expect(parseDuration('00:40:00.0001')).toBe(2400000.1);
    expect(parseDuration('00:40:50.00012')).toBe(2450000.12);
  });
});
