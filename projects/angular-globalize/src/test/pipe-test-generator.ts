import { PipeTransform, ChangeDetectorRef, WrappedValue } from '@angular/core';
import { Subject } from 'rxjs';

import { ChangeDetectorMock } from './change-detector-mock';
import { GlobalizationService } from '../lib/services/globalization/globalization.service';
import { TestBed } from '@angular/core/testing';
import { CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER, CANG_DEFAULT_LOCALE_KEY, CANG_LOCALE_STORAGE_KEY } from '../lib/constants';
import { StorageLocaleProviderService } from '../lib/services/locale-provider/storage-locale-provider.service';
import { loadGlobalizeData } from './globalize-data-loader';
import { CurrentCultureService } from '../lib/services/current-culture/current-culture.service';

type PipeConstructor = new (
  globalizeService: GlobalizationService,
  cultureService: CurrentCultureService,
  cd: ChangeDetectorRef,
) => PipeTransform;

function pipeIt(expection: string,
  pipeFactory: (ref: ChangeDetectorRef) => PipeTransform,
  expectedMarkCount: number,
  formatMethodName: string,
  globalizeArgs: any[] | null | undefined,
  callback: () => void,
  value: any,
  moreArgs: any[],
  ...args: any[]) {
  it(expection, () => {
    const mock = new ChangeDetectorMock();
    const pipe = pipeFactory(mock);
    let result: any;
    const newArgs = (moreArgs || []).concat(args);
    const sub = mock.changeObservable.subscribe(() => {
      result = pipe.transform(value, ...newArgs);
    });
    result = pipe.transform(value, ...newArgs);
    if (callback) {
      callback();
    }
    sub.unsubscribe();
    if (WrappedValue.isWrapped(result)) {
      result = WrappedValue.unwrap(result);
    }
    let expectedValue: string | null | undefined;
    if (globalizeArgs && Array.isArray(globalizeArgs)) {
      const globalizeService: GlobalizationService = TestBed.get(GlobalizationService);
      const formatMethod: (...args) => string = globalizeService[formatMethodName];
      expectedValue = formatMethod.apply(globalizeService, globalizeArgs);
    } else if (globalizeArgs === null) {
      expectedValue = null;
    } else if (globalizeArgs === undefined) {
      expectedValue = undefined;
    }
    expect(result).toBe(expectedValue);
    expect(mock.markCount).toBe(expectedMarkCount);
  });
}

export function generatePipeTests(pipeConstructor: PipeConstructor,
  lang: string,
  testVal: any,
  formatMethodName: string,
  style: string,
  defaultOptions: any,
  styleOptions: any,
  options: any,
  ...args: any[]): void {
  describe(pipeConstructor.name, () => {

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

    const pipeFactory = (mock: ChangeDetectorRef) => {
      const globalizeService: GlobalizationService = TestBed.get(GlobalizationService);
      const cultureService: CurrentCultureService = TestBed.get(CurrentCultureService);
      return new pipeConstructor(globalizeService, cultureService, mock);
    };

    pipeIt('transforms null to null', pipeFactory, 0, formatMethodName, null, null, null, args);
    pipeIt('transforms null:lang to null', pipeFactory, 0, formatMethodName, null, null, null, args, lang);
    pipeIt('transforms null:lang:style to null', pipeFactory, 0, formatMethodName, null, null, null, args, lang, style);
    pipeIt('transforms null:lang:opt to null', pipeFactory, 0, formatMethodName, null, null, null, args, lang, options);
    pipeIt('transforms null:style to null', pipeFactory, 0, formatMethodName, null, null, null, args, style);
    pipeIt('transforms null:opt to null', pipeFactory, 0, formatMethodName, null, null, null, args, options);

    pipeIt('transforms undefined to undefined', pipeFactory, 0, formatMethodName, undefined, null, undefined, args);
    pipeIt('transforms undefined:lang to undefined', pipeFactory, 0, formatMethodName, undefined, null, undefined, args, lang);
    pipeIt('transforms undefined:lang:style to undefined',
      pipeFactory, 0, formatMethodName, undefined, null, undefined, args, lang, style);
    pipeIt('transforms undefined:lang:opt to undefined',
      pipeFactory, 0, formatMethodName, undefined, null, undefined, args, lang, options);
    pipeIt('transforms undefined:style to undefined', pipeFactory, 0, formatMethodName, undefined, null, undefined, args, style);
    pipeIt('transforms undefined:opt to undefined', pipeFactory, 0, formatMethodName, undefined, null, undefined, args, options);

    const ar = [testVal].concat(args);

    const defVal = ar.concat(defaultOptions);
    const styleVal = ar.concat(styleOptions);
    const optionsVal = ar.concat(options);

    const langVal = ar.concat([lang, defaultOptions]);
    const langStyleVal = ar.concat([lang, styleOptions]);
    const langOptionsVal = ar.concat([lang, options]);

    pipeIt('transforms val to string', pipeFactory, 1, formatMethodName, defVal, null, testVal, args);
    pipeIt('transforms val:lang to string', pipeFactory, 0, formatMethodName, langVal, null, testVal, args, lang);
    pipeIt('transforms val:lang:style to string', pipeFactory, 0, formatMethodName, langStyleVal, null, testVal, args, lang, style);
    pipeIt('transforms val:lang:opt to string', pipeFactory, 0, formatMethodName, langOptionsVal, null, testVal, args, lang, options);
    pipeIt('transforms val:style to string', pipeFactory, 1, formatMethodName, styleVal, null, testVal, args, style);
    pipeIt('transforms val:opt to string', pipeFactory, 1, formatMethodName, optionsVal, null, testVal, args, options);

    const subject = new Subject<any>();
    const obs = subject.asObservable();

    pipeIt('transforms obs to string', pipeFactory, 1, formatMethodName, defVal, () => subject.next(testVal), obs, args);
    pipeIt('transforms obs:lang to string', pipeFactory, 1, formatMethodName, langVal, () => subject.next(testVal), obs, args, lang);
    pipeIt('transforms obs:lang:style to string', pipeFactory,
      1, formatMethodName, langStyleVal, () => subject.next(testVal), obs, args, lang, style);
    pipeIt('transforms obs:lang:opt to string', pipeFactory,
      1, formatMethodName, langOptionsVal, () => subject.next(testVal), obs, args, lang, options);
    pipeIt('transforms obs:style to string', pipeFactory, 1, formatMethodName, styleVal, () => subject.next(testVal), obs, args, style);
    pipeIt('transforms obs:opt to string', pipeFactory, 1,
      formatMethodName, optionsVal, () => subject.next(testVal), obs, args, options);
  });
}
