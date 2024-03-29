import { Injectable } from '@angular/core';
import { dateParser, numberParser } from 'globalize';
import type { DateFormatterOptions, NumberParserOptions, NumberFormatterOptions, CurrencyFormatterOptions } from 'globalize';

import {
  FormatterFactory, FormatterFunction,
  ParserFactory, ParserFunction, DurationFormatOptions, MonthNameFormat, DayNameFormat
} from '../../models';
import { CldrService } from './cldr.service';
import { CurrentCultureService } from '../current-culture/current-culture.service';

const timeSpanRx = /^(?:(\d+)\.)?(\d{1,2}):(\d{1,2}):(\d{1,2})(?:\.(\d{1,7}))?$/;

export function parseDuration(duration: string | null | undefined): number | null {
  if (!duration) {
    return null;
  }
  const m = timeSpanRx.exec(duration);
  if (m) {
    let val = parseInt(m[2], 10) * 3600_000
      + parseInt(m[3], 10) * 60_000
      + parseInt(m[4], 10) * 1000;
    if (m[5]) {
      val += parseInt(m[5], 10) / Math.pow(10, m[5].length) * 1000;
    }
    if (m[1]) {
      val += parseInt(m[1], 10) * 3600_00 * 24;
    }
    return val;
  }
  return null;
}

/**
 * Default globalization service used when none is provided via dependency injection
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalizationService {
  private readonly numberParsers: Record<string, ParserFunction<number>> = {};
  private readonly dateParsers: Record<string, ParserFunction<Date>> = {};
  private readonly numberFormatters: Record<string, FormatterFunction<number>> = {};
  private readonly durationFormatters: Record<string, FormatterFunction<number>> = {};
  private readonly currencyFormatters: Record<string, Record<string, FormatterFunction<number>>> = {};
  private readonly dateFormatters: Record<string, FormatterFunction<Date>> = {};

  // using any for globaize parameter in the constructor
  // because the angular compiler complains about GlobalizeStatic type
  constructor(
    private readonly cldrService: CldrService,
    private readonly cultureService: CurrentCultureService) {
  }

  public formatDuration(
    val: null | undefined,
    localeOrOptions?: string | DurationFormatOptions | null,
    options?: DurationFormatOptions | null): '';
  public formatDuration(
    val: number | null | undefined,
    localeOrOptions?: string | DurationFormatOptions | null,
    options?: DurationFormatOptions | null): string;
  public formatDuration(
    val: number | null | undefined,
    localeOrOptions?: string | DurationFormatOptions | null,
    options?: DurationFormatOptions | null): string {
    return this.format(this.durationFormatters,
      (l, o) => this.durationFormatter(l, o || undefined), val, localeOrOptions, options);
  }

  public parseDate(
    val: null | undefined,
    options?: DateFormatterOptions): null;
  public parseDate(
    val: string | null | undefined,
    options?: DateFormatterOptions): Date | null;
  public parseDate(
    val: null | undefined,
    locale?: string,
    options?: DateFormatterOptions): null;
  public parseDate(
    val: string | null | undefined,
    locale?: string,
    options?: DateFormatterOptions): Date | null;
  public parseDate(
    val: string | null | undefined,
    localeOrOptions?: string | DateFormatterOptions,
    options?: DateFormatterOptions): Date | null | undefined {
    return this.parse(
      this.dateParsers,
      dateParser,
      val,
      localeOrOptions, options);
  }

  public formatDate(
    val: null | undefined, options?: DateFormatterOptions | null): '';
  public formatDate(
    val: Date | null | undefined, options?: DateFormatterOptions | null): string;
  public formatDate(
    val: null | undefined, locale?: string | null, options?: DateFormatterOptions | null): '';
  public formatDate(
    val: Date | null | undefined, locale?: string | null, options?: DateFormatterOptions | null): string;
  public formatDate(
    val: Date | null | undefined,
    localeOrOptions?: string | DateFormatterOptions | null | undefined,
    options?: DateFormatterOptions | null): string {
    return this.format(this.dateFormatters,
      (l, o) => this.cldrService.getGlobalizeInstance(l).dateFormatter(o),
      val, localeOrOptions, options);
  }

  public parseNumber(
    val: null | undefined, options?: NumberParserOptions | null): null;
  public parseNumber(
    val: string | null | undefined, options?: NumberParserOptions | null): number | null;
  public parseNumber(
    val: null | undefined, locale?: string, options?: NumberParserOptions | null): null;
  public parseNumber(
    val: string | null | undefined, locale?: string, options?: NumberParserOptions | null): number | null;
  public parseNumber(
    val: string | null | undefined,
    localeOrOptions?: string | NumberParserOptions | undefined | null,
    options?: NumberParserOptions | null): number | null {
    return this.parse(this.numberParsers,
      numberParser,
      val,
      localeOrOptions, options);
  }

  public formatNumber(
    val: null | undefined, options?: NumberFormatterOptions | null): '';
  public formatNumber(
    val: number | null | undefined, options?: NumberFormatterOptions | null): string;
  public formatNumber(
    val: null | undefined, locale?: string | null, options?: NumberFormatterOptions | null): '';
  public formatNumber(
    val: number | null | undefined, locale?: string | null, options?: NumberFormatterOptions | null): string;
  public formatNumber(
    val: number | null | undefined,
    localeOrOptions?: string | NumberFormatterOptions | undefined | null,
    options?: NumberFormatterOptions | null): string {
    return this.format(this.numberFormatters,
      (l, o) => this.cldrService.getGlobalizeInstance(l).numberFormatter(o),
      val, localeOrOptions, options);
  }

  public formatCurrency(
    val: null | undefined, currency: string, options?: CurrencyFormatterOptions | null): '';
  public formatCurrency(
    val: number | null | undefined, currency: string, options?: CurrencyFormatterOptions | null): string;
  public formatCurrency<T extends number | null | undefined>(
    val: null | undefined, currency: string, locale?: string | null, options?: CurrencyFormatterOptions | null): '';
  public formatCurrency<T extends number | null | undefined>(
    val: number | null | undefined, currency: string, locale?: string | null, options?: CurrencyFormatterOptions | null): string;
  public formatCurrency(
    val: number | null | undefined,
    currency: string,
    localeOrOptions: string | CurrencyFormatterOptions | undefined | null,
    options?: CurrencyFormatterOptions | null): string {
    const dictionary = this.currencyFormatters[currency] || (this.currencyFormatters[currency] = {});
    return this.format(dictionary,
      (l, o) => this.cldrService.getGlobalizeInstance(l).currencyFormatter(currency, o),
      val, localeOrOptions, options);
  }

  public getMonthName(
    month: null | undefined, locale?: string, type?: MonthNameFormat): '';
  public getMonthName(
    month: number | null | undefined, locale?: string, type?: MonthNameFormat): string;
  public getMonthName(
    month: number | null | undefined,
    locale?: string,
    type?: MonthNameFormat): string {
    if (month === null) {
      return '';
    }
    if (month === undefined) {
      return '';
    }
    if (!type && (locale === 'abbreviated' || locale === 'narrow' || locale === 'wide')) {
      type = locale;
      locale = '';
    }
    if (!locale) {
      locale = this.cultureService.currentCulture;
    }
    return this.cldrService.getCalendar(locale).getMonthNames(type)[month as number];
  }

  public getDayName(
    day: null | undefined, locale?: string, type?: DayNameFormat): '';
  public getDayName(
    day: number | null | undefined, locale?: string, type?: DayNameFormat): string;
  public getDayName(
    day: number | null | undefined,
    locale?: string,
    type?: DayNameFormat): string {
    if (day === null) {
      return '';
    }
    if (day === undefined) {
      return '';
    }
    if (!type && (locale === 'abbreviated' || locale === 'short' || locale === 'narrow' || locale === 'wide')) {
      type = locale;
      locale = '';
    }
    if (!locale) {
      locale = this.cultureService.currentCulture;
    }
    return this.cldrService.getCalendar(locale).getDayNames(type)[day];
  }

  private resolveOptions<TOptions>(
    localeOrOptions: string | TOptions | null | undefined,
    options: TOptions | null | undefined): [string, TOptions | undefined, string] {
    let locale: string;
    if (typeof localeOrOptions === 'string' || options) {
      if (localeOrOptions && typeof (localeOrOptions) !== 'string') {
        throw new Error(`Invalid locale ${localeOrOptions}`);
      }
      locale = (localeOrOptions as string) || this.cultureService.currentCulture;
    } else {
      locale = this.cultureService.currentCulture;
      options = localeOrOptions;
    }
    options = options || undefined;
    const key = JSON.stringify({ l: locale, o: options });
    return [locale, options || undefined, key];
  }

  private format<TInput extends number | Date, TOptions>(
    dictionary: Record<string, FormatterFunction<TInput>>,
    formatterFactory: FormatterFactory<TInput, TOptions>,
    val: TInput | null | undefined,
    localeOrOptions: string | TOptions | null | undefined,
    options: TOptions | null | undefined): string {
    if (val === null) {
      return '';
    }
    if (val === undefined) {
      return '';
    }
    const [locale, o, key] = this.resolveOptions(localeOrOptions, options);
    let formatter = dictionary[key];
    if (!formatter) {
      formatter = formatterFactory(locale, o);
      dictionary[key] = formatter;
    }
    return formatter(val);
  }

  private parse<TOutput, TOptions>(
    dictionary: Record<string, ParserFunction<TOutput>>,
    parserFactory: ParserFactory<TOutput, TOptions>,
    val: string | null | undefined,
    localeOrOptions: string | TOptions | undefined | null,
    options: TOptions | null | undefined): TOutput | null {
    if (val === null) {
      return null;
    }
    if (val === undefined) {
      return null;
    }
    const [locale, o, key] = this.resolveOptions(localeOrOptions, options);
    let parser = dictionary[key];
    if (!parser) {
      const instance = this.cldrService.getGlobalizeInstance(locale);
      parser = parserFactory.apply(instance, [o]) as ParserFunction<TOutput>;
      dictionary[key] = parser;
    }
    return parser(val);
  }

  private durationFormatter(locale: string, options: DurationFormatOptions | undefined): FormatterFunction<number> {
    options = options || { style: 'short' };
    let pattern = options.pattern;
    if (!pattern) {
      const style = options.style || 'short';
      switch (style) {
        case 'long':
          pattern = '[-][d:]hh:mm:ss[.fff]';
          break;
        case 'short':
          pattern = '[-][d:]h:mm[:ss[.FFF]]';
          break;
        case 'constant':
          pattern = '[-]d:hh:mm:ss.fff';
          break;
        case 'racing':
          pattern = '[-][d:][h:]mm:ss.fff';
          break;
      }
    }
    const info = this.cldrService.getNumberFormatInfo(locale);
    function countRepeat(s: string, index: number): number {
      let count = 0;
      for (let i = index; i < s.length; i++) {
        if (s[i] !== s[index]) {
          break;
        }
        count++;
      }
      return count;
    }

    function formatNumber(v: number, minLength: number): string {
      let res = info.formatter(v);
      while (res.length < minLength) {
        res = info.zeroChar + res;
      }
      return res;
    }

    function findEndQuote(s: string, index: number): number {
      let count = 1;
      for (let i = index + 1; i < s.length; i++) {
        count++;
        if (s[i] === s[index]) {
          return count;
        }
      }
      throw new Error(`Invalid`);
    }

    function findSubPatternEnd(s: string, index: number): number {
      let count = 1;
      let nesting = 1;
      for (let i = index + 1; i < s.length; i++) {
        count++;
        if (s[i] === '[') {
          nesting++;
        }
        if (s[i] === ']') {
          nesting--;
        }
        if (nesting < 0) {
          throw new Error(`Invalid`);
        }
        if (nesting === 0) {
          return count;
        }
      }
      throw new Error(`Invalid`);
    }

    return (val: number) => {
      const negative = val < 0;
      val = negative ? -val : val;
      const days = Math.floor(val / 86400000);
      val = val % 86400000;
      const hours = Math.floor(val / 3600000);
      val = val % 3600000;
      const minutes = Math.floor(val / 60000);
      val = val % 60000;
      const seconds = Math.floor(val / 1000);
      const milliseconds = Math.round(val % 1000);

      function formatPart(sub: string): [boolean, string] {
        let result = '';
        let hasValue = false;
        let tokenLen: number;
        for (let i = 0; i < sub.length; i += tokenLen) {
          const ch = sub[i];
          tokenLen = 1;
          switch (ch) {
            case 'd':
              tokenLen = countRepeat(sub, i);
              if (tokenLen > 8) {
                throw new Error(`Invalid`);
              }
              hasValue = hasValue || days !== 0;
              result += formatNumber(days, tokenLen);
              break;
            case 'h':
              tokenLen = countRepeat(sub, i);
              if (tokenLen > 2) {
                throw new Error(`Invalid`);
              }
              hasValue = hasValue || hours !== 0;
              result += formatNumber(hours, tokenLen);
              break;
            case 'm':
              tokenLen = countRepeat(sub, i);
              if (tokenLen > 2) {
                throw new Error(`Invalid`);
              }
              hasValue = hasValue || minutes !== 0;
              result += formatNumber(minutes, tokenLen);
              break;
            case 's':
              tokenLen = countRepeat(sub, i);
              if (tokenLen > 2) {
                throw new Error(`Invalid`);
              }
              hasValue = hasValue || seconds !== 0;
              result += formatNumber(seconds, tokenLen);
              break;
            case 'f':
              tokenLen = countRepeat(sub, i);
              if (tokenLen > 3) {
                throw new Error(`Invalid`);
              }
              const msPart = Math.round(milliseconds / 1000 * Math.pow(10, tokenLen));
              hasValue = hasValue || msPart !== 0;
              result += formatNumber(msPart, tokenLen);
              break;
            case 'F':
              tokenLen = countRepeat(sub, i);
              if (tokenLen > 3) {
                throw new Error(`Invalid`);
              }
              const msMin = Math.round(milliseconds / 1000 * Math.pow(10, tokenLen));
              let s = formatNumber(msMin, tokenLen);
              while (s.length > 0 && s[s.length - 1] === info.zeroChar) {
                s = s.substr(0, s.length - 1);
              }
              hasValue = hasValue || s.length !== 0;
              result += s;
              break;
            case '\'':
            case '"':
              tokenLen = findEndQuote(sub, i);
              result += sub.substr(i + 1, tokenLen - 2);
              break;
            case '\\':
              if (sub.length < i + 2) {
                throw new Error(`Invalid`);
              }
              tokenLen = 2;
              result += sub[i + 1];
              break;
            case '[':
              tokenLen = findSubPatternEnd(sub, i);
              const [h, r] = formatPart(sub.substr(i + 1, tokenLen - 2));
              hasValue = hasValue || h;
              if (h) {
                result += r;
              }
              break;
            case '-':
            case '+':
              tokenLen = 1;
              hasValue = hasValue || negative;
              result += negative ? info.minusSign : info.plusSign;
              break;
            case '.':
              result += info.decimalSeperator;
              break;
            case ':':
              result += info.timeSeparator;
              break;
            default:
              throw new Error(`Invalid`);
          }
        }
        return [hasValue, result];
      }
      try {
        if (!pattern) {
          throw new Error(`Invalid duration format '${pattern}'`);
        }
        const [, r] = formatPart(pattern);
        return r;
      } catch (e) {
        if (e === 'Invalid') {
          throw new Error(`Invalid duration format '${pattern}'`);
        }
        throw e;
      }
    };
  }
}
