
export type MonthNameFormat =  'abbreviated' | 'narrow' | 'wide';
export type DayNameFormat = 'abbreviated' | 'short' | 'narrow' | 'wide';

export interface ICalendarServiceImpl {
  getMonthNames(type?: MonthNameFormat): ReadonlyArray<string>;
  getDayNames(type?: DayNameFormat): ReadonlyArray<string>;
  getMonthsInYear(year: number): number;
  getDaysInMonth(year: number, month: number): number;
}

export interface ICalendarService extends ICalendarServiceImpl {
    getMonthNames(type?: MonthNameFormat): ReadonlyArray<string>;
    getDayNames(type?: DayNameFormat): ReadonlyArray<string>;
    getMonthsInYear(year: number): number;
    getDaysInMonth(year: number, month: number): number;
}

export interface DurationFormatOptions {
    /**
     * constant = [-]d:hh:mm:ss.fff
     * short = [-][d:]h:mm[:ss[.FFF]]
     * long = [-][d:]hh:mm:ss[.fff]
     * racing = [-][d:][h:]mm:ss.fff
     */
    style?: 'constant' | 'short' | 'long' | 'racing';
    pattern?: string;
}

export interface ILocaleProvider {
    canWrite: boolean;
    locale: string;
}

export interface Dictionary<T> {
    [key: string]: T|undefined;
}

export interface NumberFormatInfo {
    zeroChar: string;
    plusSign: string;
    minusSign: string;
    timeSeparator: string;
    decimalSeperator: string;
    groupSeperator: string;
    formatter: FormatterFunction<number>;
}

export type FormatterFunction<TInput> = (val: TInput) => string;
export type FormatterFactory<TInput, TOptions>
    = (locale: string, options: TOptions|undefined) => FormatterFunction<TInput>;
export type ParserFunction<TOutput> = (val: string) => TOutput;
export type ParserFactory<TOutput, TOptions>
    = (options: TOptions | undefined) => ParserFunction<TOutput>;
