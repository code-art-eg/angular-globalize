import { Injectable } from '@angular/core';
import { Dictionary, NumberFormatInfo, ICalendarService } from '../../models';
import { GregorianCalendarService } from './calendar.service';
import Globalize from 'globalize';

export interface CalendarAccessor extends Globalize {
    calendarService: ICalendarService;
}

@Injectable({
    providedIn: 'root',
})
export class CldrService {
    private readonly globalizeInstances: Dictionary<Globalize> = {};
    private readonly numberFormatInfos: Dictionary<NumberFormatInfo> = {};

    public getGlobalizeInstance(locale: string): Globalize {
        let instance = this.globalizeInstances[locale];
        if (!instance) {
            instance = new Globalize(locale);
            this.globalizeInstances[locale] = instance;
        }
        return instance;
    }

    public getCldrData(locale: string, paths: string[]|string): any {
        if (typeof paths === 'string') {
            return this.getGlobalizeInstance(locale).cldr.main(paths);
        }
        return this.getGlobalizeInstance(locale).cldr.main(paths);
    }

    public getNumberFormatInfo(locale: string): NumberFormatInfo {
        let info = this.numberFormatInfos[locale];
        if (!info) {
            const system = this.getCldrData(locale, ['numbers', 'defaultNumberingSystem']) as string;
            const symbols = this.getCldrData(locale,
                 ['numbers', 'symbols-numberSystem-' + system]) as { [key: string]: string };
            const formatter = this.getGlobalizeInstance(locale).numberFormatter({ style: 'decimal' });
            info = {
                decimalSeperator: symbols.decimal,
                formatter,
                groupSeperator: symbols.group,
                minusSign: symbols.minusSign,
                plusSign: symbols.plusSign,
                timeSeparator: ':',
                zeroChar: formatter(0),
            };
            this.numberFormatInfos[locale] = info;
        }
        return info;
    }

    public getCalendar(locale: string, calendarName?: string): ICalendarService {
        if (calendarName) {
            if (calendarName.toLowerCase() !== 'gregorian') {
                throw new Error(`Only gregorian calendar is supported`);
            }
        }
        const globalizeInstance = this.getGlobalizeInstance(locale) as CalendarAccessor;
        if (globalizeInstance.calendarService) {
            return globalizeInstance.calendarService;
        }
        const calendar = new GregorianCalendarService(globalizeInstance.cldr);
        globalizeInstance.calendarService = calendar;
        return calendar;
    }

    public getYesMessage(locale: string): string {
        return this.getCldrData(locale, ['posix', 'messages', 'yesstr']).split(':')[0];
    }

    public getNoMessage(locale: string): string {
        return this.getCldrData(locale, ['posix', 'messages', 'nostr']).split(':')[0];
    }
}
