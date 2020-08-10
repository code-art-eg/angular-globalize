import { ChangeDetectorRef, WrappedValue, Injectable } from '@angular/core';
import type { OnDestroy, PipeTransform } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';

import { CurrentCultureService } from '../services/current-culture/current-culture.service';
import { GlobalizationService } from '../services/globalization/globalization.service';

function isValidCulture(locale: string): boolean {
  return /^[A-Za-z]{2}([-_][A-Za-z0-9]{2,8})*$/.test(locale);
}

@Injectable()
export abstract class BaseGlobalizePipe<TInput, TOptions> implements OnDestroy, PipeTransform {
  private _subscription: Subscription | null = null;
  private _latestValue: string | null | undefined;
  private _latestReturnedValue: string | null | undefined;

  private _obj: Observable<any> | null = null;
  private _objType: 'culture' | 'input' | 'both' | null = null;
  private _input: TInput | null | undefined = null;
  private _locale = '';
  private _options: TOptions | undefined;
  private _latestSource: Observable<TInput | null | undefined> | null = null;
  private _latest: Observable<[string, TInput | null | undefined]> | null = null;

  constructor(
    protected readonly globalizeService: GlobalizationService,
    protected readonly cultureService: CurrentCultureService,
    protected changeDetector: ChangeDetectorRef,
  ) {
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  public transform(
    input: null,
    localeOrOptionsOrFormat?: TOptions | string | null,
    optionsOrFormat?: TOptions | string | undefined | null): null;
  public transform(
    input: undefined,
    localeOrOptionsOrFormat?: TOptions | string | null,
    optionsOrFormat?: TOptions | string | null): undefined;
  public transform(
    input: TInput|null|undefined,
    localeOrOptionsOrFormat?: TOptions | string | null,
    optionsOrFormat?: TOptions | string | null): string | null | undefined;
  public transform(
    input: Observable<TInput | null | undefined>,
    localeOrOptionsOrFormat?: TOptions | string | null,
    optionsOrFormat?: TOptions | string | null): WrappedValue;
  public transform(
      input: TInput | Observable<TInput | null | undefined> | null | undefined,
      localeOrOptionsOrFormat?: TOptions | string | null,
      optionsOrFormat?: TOptions | string | null): string | null | undefined | WrappedValue;
  public transform(
    input: TInput | Observable<TInput | null | undefined> | null | undefined,
    localeOrOptionsOrFormat?: TOptions | string | null,
    optionsOrFormat?: TOptions | string | null): string | null | undefined | WrappedValue {
    return this.doTransform(input, localeOrOptionsOrFormat, optionsOrFormat);
  }

  protected abstract inputsEqual(v1: TInput, v2: TInput): boolean;

  protected abstract optionsEqual(o1: TOptions, o2: TOptions): boolean;

  protected abstract getDefaultOptions(): TOptions;

  protected abstract stringToOptions(optionsString: string): TOptions;

  protected abstract convertValue(input: TInput, locale: string | undefined, options: TOptions): string;

  protected doTransform(
    input: TInput | Observable<TInput | null | undefined> | null | undefined,
    localeOrOptionsOrFormat?: TOptions | string | null,
    optionsOrFormat?: TOptions | string | null): string | null | undefined | WrappedValue {
    const [locale, options] = this.resolveParameters(localeOrOptionsOrFormat, optionsOrFormat);
    const [obj, objType, newInput] = this.resolveObject(input, locale, options);
    return this.transformInternal(obj, objType, newInput, locale, options);
  }

  private inputsEqualInternal(v1: TInput | null | undefined, v2: TInput | null | undefined): boolean {
    if (v1 === null) {
      return v2 === null;
    } else if (v1 === undefined) {
      return v2 === undefined;
    } else if (v2 === null || v2 === undefined) {
      return false;
    }
    return this.inputsEqual(v1, v2);
  }

  private optionsEqualInternal(o1: TOptions | undefined, o2: TOptions | undefined) {
    return this.optionsEqual(o1 || this.getDefaultOptions(), o2 || this.getDefaultOptions());
  }

  private dispose(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    this._subscription = null;
    this._obj = null;
    this._objType = null;
    this._options = undefined;
    this._locale = '';
    this._latest = null;
    this._latestSource = null;
    this._latestValue = undefined;
    this._latestReturnedValue = undefined;
    this._input = undefined;
  }

  private transformInternal(
    obj: Observable<any> | null,
    objType: 'culture' | 'input' | 'both' | null,
    input: TInput | undefined | null,
    locale: string,
    options: TOptions | undefined): string | null | undefined | WrappedValue {
    if (!this._obj) {
      if (obj) {
        this.subscribe(obj, objType, input, locale, options);
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (obj !== this._obj
      || objType !== this._objType
      || !this.inputsEqualInternal(input, this._input)
      || !this.optionsEqualInternal(options, this._options)
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

  private resolveObject(
    input: TInput | Observable<TInput | null | undefined> | null | undefined,
    locale: string,
    options: TOptions | undefined,
  ):
    [Observable<any> | null, 'culture' | 'input' | 'both' | null, TInput | undefined | null] {
    if (input === null) {
      this._latestValue = this._latestReturnedValue = null;
      return [null, null, null];
    }
    if (input === undefined) {
      this._latestValue = this._latestReturnedValue = undefined;
      return [null, null, undefined];
    }
    if (input instanceof Observable) {
      if (locale !== '') {
        return [input, 'input', null];
      }
      if (!this._latest || this._latestSource !== input) {
        this._latest = combineLatest([this.cultureService.cultureObservable, input]);
        this._latestSource = input;
      }
      return [this._latest, 'both', null];
    }
    if (locale !== '') {
      this._latestValue =
        this._latestReturnedValue
        = this.convertValue(input, locale, options || this.getDefaultOptions());
      return [null, null, null];
    }
    return [this.cultureService.cultureObservable, 'culture', input];
  }

  private resolveParameters(
    localeOrOptionsOrFormat: TOptions | string | undefined | null,
    optionsOrFormat: TOptions | string | undefined | null,
  ):
    [string, TOptions | undefined] {
    let locale: string;
    let options: TOptions | undefined;
    if (optionsOrFormat) {
      if (typeof (localeOrOptionsOrFormat) !== 'string') {
        if (localeOrOptionsOrFormat) {
          throw new Error('Locale must be a string');
        } else {
          locale = '';
        }
      } else {
        locale = localeOrOptionsOrFormat;
        if (typeof optionsOrFormat === 'string') {
          options = this.stringToOptions(optionsOrFormat);
        } else {
          options = optionsOrFormat;
        }
      }
    } else {
      if (!localeOrOptionsOrFormat) {
        locale = '';
        options = undefined;
      } else if (typeof (localeOrOptionsOrFormat) === 'string') {
        if (isValidCulture(localeOrOptionsOrFormat)) {
          locale = localeOrOptionsOrFormat;
        } else {
          options = this.stringToOptions(localeOrOptionsOrFormat);
          locale = '';
        }
      } else {
        locale = '';
        options = localeOrOptionsOrFormat;
      }
    }
    return [locale, options];
  }

  private subscribe(
    obj: Observable<any>,
    objType: 'culture' | 'input' | 'both' | null,
    input: TInput | undefined | null,
    locale: string,
    options: TOptions | undefined,
  ): void {
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
    let loc: string | undefined;
    let value: TInput | undefined | null;
    if (this._objType === 'culture') {
      loc = vals as string;
      value = this._input;
    } else if (this._objType === 'input') {
      value = vals as TInput;
      loc = this._locale;
    } else {
      [loc, value] = vals as [string, TInput];
    }
    if (value === null) {
      this._latestValue = null;
    } else if (value === undefined) {
      this._latestValue = undefined;
    } else {
      this._latestValue = this.convertValue(value, loc, this._options || this.getDefaultOptions());
    }
    if (this.changeDetector) {
      this.changeDetector.markForCheck();
    }
  }
}
