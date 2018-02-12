

export interface ICalendarService {
    getMonthNames(type?: 'abbreviated' | 'narrow' | 'wide'): ReadonlyArray<string>;
    getDayNames(type?: 'abbreviated' | 'narrow' | 'short' | 'wide'): ReadonlyArray<string>;
    getMonthsInYear(year: number): number;
    getDaysInMonth(year: number, month: number): number;
    name: string;
}

export class GregorianCalendarService implements ICalendarService {

    constructor(private readonly cldr: Cldr.CldrStatic) {

    }

    readonly name: string = 'Gregorian';
    private readonly monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    getDayNames(type?: 'abbreviated' | 'narrow' | 'short' | 'wide'): ReadonlyArray<string> {
        type = type || 'wide';
        const days = this.cldr.main(['dates/calendars/gregorian/days', 'stand-alone', type]);
        if (!days)
            throw 'CLDR data for dates/calendars/gregorian/days/stand-alone/' + type +  ' is not loaded.';
        return [days["sun"], days["mon"], days["tue"], days["wed"], days["thu"], days["fri"], days["sat"]];
    }
    
    getMonthNames(type?: 'abbreviated' | 'narrow' | 'wide'): ReadonlyArray<string> {
        type = type || 'wide';
        const months = this.cldr.main(['dates/calendars/gregorian/months', 'stand-alone', type]);
        if (!months)
            throw 'CLDR data for dates/calendars/gregorian/months/stand-alone/' + type +  ' is not loaded.';
        return [months["1"], months["2"], months["3"], months["4"], months["5"], months["6"], months["7"], months["8"], months["9"], months["10"], months["11"], months["12"]];
    }
    
    getMonthsInYear(year: number): number {
        return 12;
    }
    
    getDaysInMonth(year: number, month: number): number {
        if (month < 0 || month > 11) {
            throw `Invalid value for month. In Gregorian Calendar month can be from 0 to 11.`;
        }
        if (month !== 1) {
            return this.monthDays[month];
        }
        const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        return isLeap ? 29 : 28;
    }
}