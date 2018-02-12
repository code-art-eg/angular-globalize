import { ChangeDetectorRef, PipeTransform, WrappedValue } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

import { IGlobalizationService, ICultureService, DefaultGlobalizationService, CurrentCultureService } from '../../src/module';
import { loadedGlobalize } from '../services/load-globalize-data';
import { GlobalizeDatePipe } from '../../src/pipes/globalize-date.pipe';
import { GlobalizeTimePipe } from '../../src/pipes/globalize-time.pipe';
import { GlobalizeDateTimePipe } from '../../src/pipes/globalize-datetime.pipe';
import { GlobalizeNumberPipe } from '../../src/pipes/globalize-number.pipe';
import { GlobalizeCurrencyPipe } from '../../src/pipes/globalize-currency.pipe';
import { GlobalizeDayPipe } from '../../src/pipes/globalize-day.pipe';
import { GlobalizeMonthPipe } from '../../src/pipes/globalize-month.pipe';

import { expect } from 'chai';

const cultureService = new CurrentCultureService(['en-GB', 'de'], [{ locale: 'en-GB', canWrite: false }]);
const globalizeService = new DefaultGlobalizationService(loadedGlobalize, cultureService);

class ChangeDetectorMock extends ChangeDetectorRef {
    
    private readonly changeSubject: ReplaySubject<number>;
    public readonly changeObservable: Observable<number>;
    private markCountInternal: number;
    
    public get markCount(): number {
        return this.markCountInternal;
    }
    
    markForCheck(): void {
        this.markCountInternal++;
        this.changeSubject.next(this.markCountInternal);
    }

    detach(): void {
    }

    detectChanges(): void {
    }

    checkNoChanges(): void {
    }

    reattach(): void {
    }
    
    constructor() {
        super();
        this.markCountInternal = 0;
        this.changeSubject = new ReplaySubject(1);
        this.changeObservable = this.changeSubject.asObservable();
    }
}

function pipeIt(expection: string,
    pipeFactory: (ref: ChangeDetectorRef) => PipeTransform,
    expectedMarkCount: number,
    expectedValue: any,
    callback: () => void,
    value: any,
    moreArgs: any[],
    ...args: any[]
) {
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
        expect(result).equal(expectedValue);
        expect(mock.markCount).equal(expectedMarkCount);
    });
}

function generateTests(
    pipeFactory: (ref: ChangeDetectorRef) => PipeTransform,
    lang: string,
    testVal: any, 
    globalizeService: IGlobalizationService, 
    formatMethod: Function,
    style: string,
    defaultOptions: any,
    styleOptions: any,
    options: any,
    ...args: any[]
    ): void {

    
    pipeIt("transforms null to null", pipeFactory, 0, null, null, null, args);
    pipeIt("transforms null:lang to null", pipeFactory, 0, null, null, null, args, lang);
    pipeIt("transforms null:lang:style to null", pipeFactory, 0, null, null, null, args, lang, style);
    pipeIt("transforms null:lang:opt to null", pipeFactory, 0, null, null, null, args, lang, options);
    pipeIt("transforms null:style to null", pipeFactory, 0, null, null, null, args, style);
    pipeIt("transforms null:opt to null", pipeFactory, 0, null, null, null, args, options);

    pipeIt("transforms undefined to undefined", pipeFactory, 0, undefined, null, undefined, args);
    pipeIt("transforms undefined:lang to undefined", pipeFactory, 0, undefined, null, undefined, args, lang);
    pipeIt("transforms undefined:lang:style to undefined", pipeFactory, 0, undefined, null, undefined, args, lang, style);
    pipeIt("transforms undefined:lang:opt to undefined", pipeFactory, 0, undefined, null, undefined, args, lang, options);
    pipeIt("transforms undefined:style to undefined", pipeFactory, 0, undefined, null, undefined, args, style);
    pipeIt("transforms undefined:opt to undefined", pipeFactory, 0, undefined, null, undefined, args, options);

    const ar = [testVal].concat(args);

    const defVal = formatMethod.apply(globalizeService, ar.concat(defaultOptions));
    const styleVal = formatMethod.apply(globalizeService, ar.concat(styleOptions));
    const optionsVal = formatMethod.apply(globalizeService, ar.concat(options));

    const langVal = formatMethod.apply(globalizeService, ar.concat([lang, defaultOptions]));
    const langStyleVal = formatMethod.apply(globalizeService, ar.concat([lang, styleOptions]));
    const langOptionsVal = formatMethod.apply(globalizeService, ar.concat([lang, options]));

    pipeIt("transforms val to string", pipeFactory, 1, defVal, null, testVal, args);
    pipeIt("transforms val:lang to string", pipeFactory, 0, langVal, null, testVal, args, lang);
    pipeIt("transforms val:lang:style to string", pipeFactory, 0, langStyleVal, null, testVal, args, lang, style);
    pipeIt("transforms val:lang:opt to string", pipeFactory, 0, langOptionsVal, null, testVal, args, lang, options);
    pipeIt("transforms val:style to string", pipeFactory, 1, styleVal, null, testVal, args, style);
    pipeIt("transforms val:opt to string", pipeFactory, 1, optionsVal, null, testVal, args, options);

    const subject = new Subject<any>();
    const obs = subject.asObservable();

    pipeIt("transforms obs to string", pipeFactory, 1, defVal, () => subject.next(testVal), obs, args);
    pipeIt("transforms obs:lang to string", pipeFactory, 1, langVal, () => subject.next(testVal), obs, args, lang);
    pipeIt("transforms obs:lang:style to string", pipeFactory, 1, langStyleVal, () => subject.next(testVal), obs, args, lang, style);
    pipeIt("transforms obs:lang:opt to string", pipeFactory, 1, langOptionsVal, () => subject.next(testVal), obs, args, lang, options);
    pipeIt("transforms obs:style to string", pipeFactory, 1, styleVal, () => subject.next(testVal), obs, args, style);
    pipeIt("transforms obs:opt to string", pipeFactory, 1, optionsVal, () => subject.next(testVal), obs, args, options);
}


describe("Globalize Date Pipe", () => {
    const pipeFactory = (mock: ChangeDetectorRef) => new GlobalizeDatePipe(globalizeService, cultureService, mock);
    generateTests(pipeFactory, 'de', new Date(), globalizeService, globalizeService.formatDate, 'full', { date: 'short' }, { date: 'full' }, { date: 'long' });
});

describe("Globalize DateTime Pipe", () => {
    const pipeFactory = (mock: ChangeDetectorRef) => new GlobalizeDateTimePipe(globalizeService, cultureService, mock);
    generateTests(pipeFactory, 'de', new Date(), globalizeService, globalizeService.formatDate, 'full', { datetime: 'short' }, { datetime: 'full' }, { datetime: 'long' });
});

describe("Globalize Time Pipe", () => {
    const pipeFactory = (mock: ChangeDetectorRef) => new GlobalizeTimePipe(globalizeService, cultureService, mock);
    generateTests(pipeFactory, 'de', new Date(), globalizeService, globalizeService.formatDate, 'full', { time: 'short' }, { time: 'full' }, { time: 'long' });
});

describe("Globalize Number Pipe", () => {
    const pipeFactory = (mock: ChangeDetectorRef) => new GlobalizeNumberPipe(globalizeService, cultureService, mock);
    generateTests(pipeFactory, 'de', 1234.56, globalizeService, globalizeService.formatNumber, 'decimal', { style: 'decimal' }, { style: 'decimal' }, { style: 'decimal' });
});

describe("Globalize Currency Pipe", () => {
    const pipeFactory = (mock: ChangeDetectorRef) => new GlobalizeCurrencyPipe(globalizeService, cultureService, mock);
    generateTests(pipeFactory, 'de', 1234.56, globalizeService, globalizeService.formatCurrency, 'symbol', { style: 'symbol' }, { style: 'symbol' }, { style: 'symbol' }, 'EUR');
});


describe("Globalize Day Pipe", () => {
    const pipeFactory = (mock: ChangeDetectorRef) => new GlobalizeDayPipe(globalizeService, cultureService, mock);
    generateTests(pipeFactory, 'de', 0, globalizeService, globalizeService.getDayName, 'wide', 'wide', 'wide', 'wide');
});

describe("Globalize Month Pipe", () => {
    const pipeFactory = (mock: ChangeDetectorRef) => new GlobalizeMonthPipe(globalizeService, cultureService, mock);
    generateTests(pipeFactory, 'de', 0, globalizeService, globalizeService.getMonthName, 'wide', 'wide', 'wide', 'wide');
});