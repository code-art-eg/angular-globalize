import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Pipe, PipeTransform, Inject, OnDestroy, ChangeDetectorRef, WrappedValue } from '@angular/core';

import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '../services/globalize.service';
import { CANG_CULTURE_SERVICE, ICultureService } from '../services/current-culture.service';

export abstract class BaseGlobalizePipe<TInput, TOptions> implements OnDestroy, PipeTransform {

    private subscription: Subscription | null;
    private latestValue: string | null | undefined;
    private latestReturnedValue: string | null | undefined;

    private obj: Observable<any> | null;
    private objType: 'culture' | 'input' | 'both' | null;
    private input: TInput | null;
    private locale: string | null;
    private options: TOptions | undefined;
    private combineLatestSource: Observable<TInput>;
    private combineLatest: Observable<[string, TInput]>;

    constructor( @Inject(CANG_GLOBALIZATION_SERVICE) protected readonly globalizService: IGlobalizationService,
        @Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService,
        private changeDetector: ChangeDetectorRef
    ) {
        this.obj = null;
        this.objType = null;

        this.subscription = null;
        this.latestReturnedValue = null;
        this.latestValue = null;
        this.combineLatest = null;
        this.combineLatestSource = null;
    }

    ngOnDestroy(): void {
        this.dispose();
    }

    private dispose(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = null;
        this.obj = null;
        this.objType = null;
        this.options = null;
        this.locale = null;
        this.combineLatest = null;
        this.combineLatestSource = null;
    }

    private transformInternal(obj: Observable<any> | null, objType: 'culture' | 'input' | 'both' | null, input: TInput | null, locale, options): string | null | undefined | WrappedValue {
        if (!this.obj) {
            if (obj) {
                this.subscribe(obj, objType, input, locale, options);
            }
            this.latestReturnedValue = this.latestValue;
            return this.latestValue;
        }

        if (obj !== this.obj 
            || objType !== this.objType 
            || !this.inputsEqual(input, this.input)
            || !this.optionsEqual(options, this.options)
            || locale !== locale) {
            this.dispose();
            return this.transformInternal(obj, objType, input, locale, options);
        }

        if (this.latestValue === this.latestReturnedValue) {
            return this.latestReturnedValue;
        }
        this.latestReturnedValue = this.latestValue;
        return WrappedValue.wrap(this.latestValue);
    }

    transform(input: null, localeOrOptionsOrFormat?: TOptions | string | undefined, optionsOrFormat?: TOptions | string | undefined): null;
    transform(input: undefined, localeOrOptionsOrFormat?: TOptions | string | undefined, optionsOrFormat?: TOptions | string | undefined): undefined;
    transform(input: TInput, localeOrOptionsOrFormat?: TOptions | string | undefined, optionsOrFormat?: TOptions | string | undefined): string;
    transform(input: Observable<TInput>, localeOrOptionsOrFormat?: TOptions | string | undefined, optionsOrFormat?: TOptions | string): string;
    transform(input: TInput | Observable<TInput> | null | undefined, localeOrOptionsOrFormat?: TOptions | string | undefined, optionsOrFormat?: TOptions | string | undefined): string | null | undefined | WrappedValue {
        return this.doTransform(input, localeOrOptionsOrFormat, optionsOrFormat);
    }

    protected doTransform(input: TInput | Observable<TInput> | null | undefined, localeOrOptionsOrFormat?: TOptions | string | undefined, optionsOrFormat?: TOptions | string | undefined): string | null | undefined | WrappedValue {
        let [locale, options] = this.resolveParameters(localeOrOptionsOrFormat, optionsOrFormat);
        let [obj, objType, newInput] = this.resolveObject(input, locale, options);
        return this.transformInternal(obj, objType, newInput, locale, options);
    }

    private resolveObject(input: TInput | Observable<TInput> | null | undefined, locale: string | null, options: TOptions | undefined): [Observable<any> | null, 'culture' | 'input' | 'both' | null, TInput | null] {
        if (input === null) {
            this.latestValue = this.latestReturnedValue = null;
            return [null, null, null];
        }
        if (input === undefined) {
            this.latestValue = this.latestReturnedValue = undefined;
            return [null, null, null];
        }
        if (input instanceof Observable) {
            if (locale !== null) {
                return [input, 'input', null];
            }
            if (!this.combineLatest || this.combineLatestSource !== input) {
                this.combineLatest = combineLatest(this.cultureService.cultureObservable, input);
                this.combineLatestSource = input;
            }
            return [this.combineLatest, 'both', null];
        }
        if (locale !== null) {
            this.latestValue = this.latestReturnedValue = this.convertValue(input, locale, options || this.getDefaultOptions());
            return [null, null, null];
        }
        return [this.cultureService.cultureObservable, 'culture', input];
    }

    private resolveParameters(localeOrOptionsOrFormat: TOptions | string | undefined, optionsOrFormat: TOptions | string | undefined): [string | null, TOptions | undefined] {
        let locale: string | null = null;
        let options: TOptions | undefined = undefined;
        if (optionsOrFormat) {
            if (typeof (localeOrOptionsOrFormat) !== 'string') {
                if (!localeOrOptionsOrFormat) {
                    locale = null;
                }
                else {
                    throw "Locale must be a string";
                }
            } else {
                locale = localeOrOptionsOrFormat;
                if (typeof optionsOrFormat === 'string') {
                    options = this.stringToOptions(optionsOrFormat);
                }
                else {
                    options = optionsOrFormat || undefined;
                }
            }
        }
        else {
            if (!localeOrOptionsOrFormat) {
                locale = null;
                options = undefined;
            } else if (typeof (localeOrOptionsOrFormat) === 'string') {
                if (this.isValidCulture(localeOrOptionsOrFormat)) {
                    locale = localeOrOptionsOrFormat;
                }
                else {
                    options = this.stringToOptions(localeOrOptionsOrFormat);
                }
            } else {
                locale = null;
                options = localeOrOptionsOrFormat || undefined;
            }
        }
        return [locale, options];
    }

    private subscribe(obj: Observable<any>, objType: 'culture' | 'input' | 'both', input: TInput | null, locale: string, options: TOptions | undefined): void {
        this.obj = obj;
        this.objType = objType;
        this.input = input;
        this.locale = locale;
        this.options = options;

        this.subscription = this.obj.subscribe({
            next: (vals: string | TInput | [string, TInput]) => this.updateLatestValues(obj, vals),
            error: (e: any) => { throw e; }
        });
    }

    private updateLatestValues(obj: Observable<any>, vals: string | TInput | [string, TInput]) {
        //if (obj !== this.obj) {
        //    return;
        //}
        let loc: string;
        let value: TInput;
        if (this.objType === 'culture') {
            loc = vals as string;
            value = this.input;
        }
        else if (this.objType === 'input') {
            value = vals as TInput;
            loc = this.locale;
        }
        else {
            [loc, value] = vals as [string, TInput];
        }
        this.latestValue = this.convertValue(value, loc, this.options || this.getDefaultOptions());
        if (this.changeDetector) {
            this.changeDetector.markForCheck();
        }
    }

    private isValidCulture(locale: string): boolean {
        return /^[A-Za-z]{2}((-|_)[A-Za-z0-9]{2,8})*$/.test(locale);
    }

    protected abstract inputsEqual(v1: TInput, v2: TInput): boolean;
    protected abstract optionsEqual(o1: TOptions, o2: TOptions): boolean;
    protected abstract getDefaultOptions(): TOptions;
    protected abstract stringToOptions(optionsString: string): TOptions;
    protected abstract convertValue(input: TInput, locale: string, options: TOptions): string;
}

export abstract class BaseDatePipe extends BaseGlobalizePipe<Date, DateFormatterOptions> {
    
    protected inputsEqual(v1: Date, v2: Date): boolean {
        if (!v1) {
            return !v2;
        }
        if (!v2) {
            return false;
        }
        return v1.valueOf() === v2.valueOf();
    }

    protected optionsEqual(o1: DateFormatterOptions, o2: DateFormatterOptions): boolean {
        if (!o1) {
            return !o2;
        }
        if (!o2)
            return false;
        return o1.date === o2.date 
            && o1.datetime === o2.datetime 
            && o1.raw === o2.raw 
            && o1.skeleton === o2.skeleton
            && o1.time === o2.time
            && o1.timeZone === o2.timeZone;
    }
}

export abstract class BaseNumericPipe<TOptions> extends BaseGlobalizePipe<number, TOptions> {
    
    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }

    protected commonOptionsEqual(o1: CommonNumberFormatterOptions, o2: CommonNumberFormatterOptions): boolean {
        if (!o1) {
            return !o2;
        }
        if (!o2)
            return false;
        return o1.maximumFractionDigits === o2.maximumFractionDigits
            && o1.maximumSignificantDigits === o2.maximumSignificantDigits
            && o1.minimumFractionDigits === o2.minimumFractionDigits
            && o1.minimumIntegerDigits === o2.minimumIntegerDigits
            && o1.minimumSignificantDigits === o2.minimumSignificantDigits
            && o1.round === o2.round
            && o1.useGrouping === o2.useGrouping;
    }
}