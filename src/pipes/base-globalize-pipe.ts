import { ChangeDetectorRef, Inject, OnDestroy, PipeTransform, WrappedValue } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { combineLatest } from "rxjs/observable/combineLatest";
import { Subscription } from "rxjs/Subscription";

import { CANG_CULTURE_SERVICE, ICultureService } from "../services/current-culture.service";
import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from "../services/globalize.service";

function isValidCulture(locale: string): boolean {
    return /^[A-Za-z]{2}([-_][A-Za-z0-9]{2,8})*$/.test(locale);
}

export abstract class BaseGlobalizePipe<TInput, TOptions> implements OnDestroy, PipeTransform {
    private _subscription: Subscription | null;
    private _latestValue: string | null | undefined;
    private _latestReturnedValue: string | null | undefined;

    private _obj: Observable<any> | null;
    private _objType: "culture" | "input" | "both" | null;
    private _input: TInput | null;
    private _locale: string | null;
    private _options: TOptions | undefined;
    private _latestSource: Observable<TInput>;
    private _latest: Observable<[string, TInput]>;

    constructor(@Inject(CANG_GLOBALIZATION_SERVICE) protected readonly globalizService: IGlobalizationService,
                @Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService,
                private changeDetector: ChangeDetectorRef) {
        this._obj = null;
        this._objType = null;

        this._subscription = null;
        this._latestReturnedValue = null;
        this._latestValue = null;
        this._latest = null;
        this._latestSource = null;
    }

    public ngOnDestroy(): void {
        this.dispose();
    }

    public transform(input: null,
                     localeOrOptionsOrFormat?: TOptions | string | undefined,
                     optionsOrFormat?: TOptions | string | undefined): null;
    public transform(input: undefined,
                     localeOrOptionsOrFormat?: TOptions | string | undefined,
                     optionsOrFormat?: TOptions | string | undefined): undefined;
    public transform(input: TInput,
                     localeOrOptionsOrFormat?: TOptions | string | undefined,
                     optionsOrFormat?: TOptions | string | undefined): string;
    public transform(input: Observable<TInput>,
                     localeOrOptionsOrFormat?: TOptions | string | undefined,
                     optionsOrFormat?: TOptions | string): string;
    public transform(input: TInput | Observable<TInput> | null | undefined,
                     localeOrOptionsOrFormat?: TOptions | string | undefined,
                     optionsOrFormat?: TOptions | string | undefined): string | null | undefined | WrappedValue {
        return this.doTransform(input, localeOrOptionsOrFormat, optionsOrFormat);
    }

    protected abstract inputsEqual(v1: TInput, v2: TInput): boolean;

    protected abstract optionsEqual(o1: TOptions, o2: TOptions): boolean;

    protected abstract getDefaultOptions(): TOptions;

    protected abstract stringToOptions(optionsString: string): TOptions;

    protected abstract convertValue(input: TInput, locale: string, options: TOptions): string;

    protected doTransform(input: TInput | Observable<TInput> | null | undefined,
                          localeOrOptionsOrFormat?: TOptions | string | undefined,
                          optionsOrFormat?: TOptions | string | undefined): string | null | undefined | WrappedValue {
        const [locale, options] = this.resolveParameters(localeOrOptionsOrFormat, optionsOrFormat);
        const [obj, objType, newInput] = this.resolveObject(input, locale, options);
        return this.transformInternal(obj, objType, newInput, locale, options);
    }

    private dispose(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
        this._obj = null;
        this._objType = null;
        this._options = null;
        this._locale = null;
        this._latest = null;
        this._latestSource = null;
    }

    private transformInternal(obj: Observable<any> | null,
                              objType: "culture" | "input" | "both" | null,
                              input: TInput | null, locale, options): string | null | undefined | WrappedValue {
        if (!this._obj) {
            if (obj) {
                this.subscribe(obj, objType, input, locale, options);
            }
            this._latestReturnedValue = this._latestValue;
            return this._latestValue;
        }

        if (obj !== this._obj
            || objType !== this._objType
            || !this.inputsEqual(input, this._input)
            || !this.optionsEqual(options, this._options)
            || locale !== locale) {
            this.dispose();
            return this.transformInternal(obj, objType, input, locale, options);
        }

        if (this._latestValue === this._latestReturnedValue) {
            return this._latestReturnedValue;
        }
        this._latestReturnedValue = this._latestValue;
        return WrappedValue.wrap(this._latestValue);
    }

    private resolveObject(input: TInput | Observable<TInput> | null | undefined,
                          locale: string | null,
                          options: TOptions | undefined): [Observable<any> | null, "culture" | "input" | "both" | null,
        TInput | null] {
        if (input === null) {
            this._latestValue = this._latestReturnedValue = null;
            return [null, null, null];
        }
        if (input === undefined) {
            this._latestValue = this._latestReturnedValue = undefined;
            return [null, null, null];
        }
        if (input instanceof Observable) {
            if (locale !== null) {
                return [input, "input", null];
            }
            if (!this._latest || this._latestSource !== input) {
                this._latest = combineLatest(this.cultureService.cultureObservable, input);
                this._latestSource = input;
            }
            return [this._latest, "both", null];
        }
        if (locale !== null) {
            this._latestValue =
                this._latestReturnedValue
                    = this.convertValue(input, locale, options || this.getDefaultOptions());
            return [null, null, null];
        }
        return [this.cultureService.cultureObservable, "culture", input];
    }

    private resolveParameters(localeOrOptionsOrFormat: TOptions | string | undefined,
                              optionsOrFormat: TOptions | string | undefined): [string | null, TOptions | undefined] {
        let locale: string | null = null;
        let options: TOptions | undefined;
        if (optionsOrFormat) {
            if (typeof (localeOrOptionsOrFormat) !== "string") {
                if (!localeOrOptionsOrFormat) {
                    locale = null;
                } else {
                    throw new Error("Locale must be a string");
                }
            } else {
                locale = localeOrOptionsOrFormat;
                if (typeof optionsOrFormat === "string") {
                    options = this.stringToOptions(optionsOrFormat);
                } else {
                    options = optionsOrFormat || undefined;
                }
            }
        } else {
            if (!localeOrOptionsOrFormat) {
                locale = null;
                options = undefined;
            } else if (typeof (localeOrOptionsOrFormat) === "string") {
                if (isValidCulture(localeOrOptionsOrFormat)) {
                    locale = localeOrOptionsOrFormat;
                } else {
                    options = this.stringToOptions(localeOrOptionsOrFormat);
                }
            } else {
                locale = null;
                options = localeOrOptionsOrFormat || undefined;
            }
        }
        return [locale, options];
    }

    private subscribe(obj: Observable<any>,
                      objType: "culture" | "input" | "both",
                      input: TInput | null, locale: string, options: TOptions | undefined): void {
        this._obj = obj;
        this._objType = objType;
        this._input = input;
        this._locale = locale;
        this._options = options;

        this._subscription = this._obj.subscribe({
            error: (e: any) => {
                throw e;
            },
            next: (vals: string | TInput | [string, TInput]) => this.updateLatestValues(vals),
        });
    }

    private updateLatestValues(vals: string | TInput | [string, TInput]) {
        let loc: string;
        let value: TInput;
        if (this._objType === "culture") {
            loc = vals as string;
            value = this._input;
        } else if (this._objType === "input") {
            value = vals as TInput;
            loc = this._locale;
        } else {
            [loc, value] = vals as [string, TInput];
        }
        this._latestValue = this.convertValue(value, loc, this._options || this.getDefaultOptions());
        if (this.changeDetector) {
            this.changeDetector.markForCheck();
        }
    }
}
