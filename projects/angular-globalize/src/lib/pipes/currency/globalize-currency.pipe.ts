import { Pipe, WrappedValue } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseNumericPipe } from '../base-numeric-pipe';
import type { CurrencyFormatterOptions } from 'globalize';

// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({ name: 'gcurrency', pure: false })
export class GlobalizeCurrencyPipe extends BaseNumericPipe<CurrencyFormatterOptions> {
  private _currency!: string;
  public transform(
    input: null,
    currency: string,
    localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined,
    optionsOrFormat?: CurrencyFormatterOptions | string | undefined): null;
  public transform(
    input: undefined,
    currency: string,
    localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined,
    optionsOrFormat?: CurrencyFormatterOptions | string | undefined): undefined;
  public transform(
    input: number,
    currency: string,
    localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined,
    optionsOrFormat?: CurrencyFormatterOptions | string | undefined): string;
  public transform(
    input: Observable<number|null|undefined>,
    currency: string,
    localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined,
    optionsOrFormat?: CurrencyFormatterOptions | string): WrappedValue;
  public transform(
    input: number | Observable<number|null|undefined> | null | undefined,
    currency: string,
    localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined,
    optionsOrFormat?: CurrencyFormatterOptions | string | undefined)
    : string | null | undefined | WrappedValue {
    this._currency = currency;
    return this.doTransform(input, localeOrOptionsOrFormat, optionsOrFormat);
  }

  protected stringToOptions(optionsString: string): CurrencyFormatterOptions {

    switch (optionsString) {
      case 'symbol':
      case 'name':
      case 'code':
      case 'accounting':
        return {
          style: optionsString,
        };
      default:
        throw new Error(
          `Invalid number format '${optionsString}'.Valid values are symbol, accounting, name or code`);
    }
  }

  protected getDefaultOptions(): CurrencyFormatterOptions {
    return { style: 'symbol' };
  }

  protected convertValue(input: number, locale: string, options: CurrencyFormatterOptions): string {
    return this.globalizeService.formatCurrency(input, this._currency, locale, options);
  }

  protected optionsEqual(o1: CurrencyFormatterOptions, o2: CurrencyFormatterOptions): boolean {
    if (!BaseNumericPipe.commonOptionsEqual(o1, o2)) {
      return false;
    }
    return o1.style === o2.style;
  }
}
