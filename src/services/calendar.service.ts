import { DayNameFormat, MonthNameFormat } from "./services-common";

export interface ICalendarService {
    name: string;
    getMonthNames(type?: MonthNameFormat): ReadonlyArray<string>;
    getDayNames(type?: DayNameFormat): ReadonlyArray<string>;
    getMonthsInYear(year: number): number;
    getDaysInMonth(year: number, month: number): number;
}

export class GregorianCalendarService implements ICalendarService {
    public readonly name: string = "Gregorian";
    private readonly monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    private readonly monthNames: { readonly [key in MonthNameFormat]: ReadonlyArray<string> };
    private readonly dayNames: { [key in DayNameFormat]: ReadonlyArray<string> };

    constructor(private readonly cldr: Cldr.CldrStatic) {
        this.monthNames = {
            abbreviated: this.getMonthNamesInternal("abbreviated"),
            narrow: this.getMonthNamesInternal("narrow"),
            wide: this.getMonthNamesInternal("wide"),
        };

        this.dayNames = {
            abbreviated: this.getDayNamesInternal("abbreviated"),
            narrow: this.getDayNamesInternal("narrow"),
            short: this.getDayNamesInternal("short"),
            wide: this.getDayNamesInternal("wide"),
        };
    }

    public getDayNames(type?: DayNameFormat): ReadonlyArray<string> {
        return this.dayNames[type || "wide"];
    }

    public getMonthNames(type?: MonthNameFormat): ReadonlyArray<string> {
        return this.monthNames[type || "wide"];
    }

    public getMonthsInYear(year: number): number {
        return 12;
    }

    public getDaysInMonth(year: number, month: number): number {
        if (month < 0 || month > 11) {
            throw new Error(`Invalid value for month. In Gregorian Calendar month can be from 0 to 11.`);
        }
        return month !== 1 ? this.monthDays[month] : ((year % 4 || (year % 400 && !(year % 100))) ? 28 : 29);
    }

    private getDayNamesInternal(type?: DayNameFormat): ReadonlyArray<string> {
        type = type || "wide";
        const days = this.cldr.main(["dates/calendars/gregorian/days", "stand-alone", type]);
        if (!days) {
            throw new Error("CLDR data for dates/calendars/gregorian/days/stand-alone/" + type + " is not loaded.");
        }
        return [days.sun, days.mon, days.tue, days.wed, days.thu, days.fri, days.sat];
    }

    private getMonthNamesInternal(type?: MonthNameFormat): ReadonlyArray<string> {
        type = type || "wide";
        const months = this.cldr.main(["dates/calendars/gregorian/months", "stand-alone", type]);
        if (!months) {
            throw new Error("CLDR data for dates/calendars/gregorian/months/stand-alone/" + type + " is not loaded.");
        }
        return [months["1"], months["2"], months["3"], months["4"],
            months["5"], months["6"], months["7"], months["8"],
            months["9"], months["10"], months["11"], months["12"]];
    }
}
