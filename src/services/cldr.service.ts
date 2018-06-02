import { Injectable } from "@angular/core";
import * as Globalize from "globalize";
import { Dictionary, NumberFormatInfo } from "../models";
import { GregorianCalendarService, ICalendarService } from "./calendar.service";

export interface CalendarAccessor extends Globalize.Static {
    calendarService: ICalendarService;
}

@Injectable()
export class CldrService {
    private readonly globalizeInstances: Dictionary<Globalize.Static> = {};
    private readonly numberFormatInfos: Dictionary<NumberFormatInfo> = {};

    constructor() {
        Globalize.load(require("cldr-data/supplemental/likelySubtags.json"));
        Globalize.load(require("cldr-data/supplemental/numberingSystems.json"));
    }

    public getGlobalizeInstance(locale: string): Globalize.Static {
        let instance = this.globalizeInstances[locale];
        if (!instance) {
            instance = new Globalize(locale);
            this.globalizeInstances[locale] = instance;
        }
        return instance;
    }

    public getCldrData(locale: string, paths: string[]|string): any {
        if (typeof paths === "string") {
            return this.getGlobalizeInstance(locale).cldr.main(paths);
        }
        return this.getGlobalizeInstance(locale).cldr.main(paths);
    }

    public getNumberFormatInfo(locale: string): NumberFormatInfo {
        let info = this.numberFormatInfos[locale];
        if (!info) {
            const system = this.getCldrData(locale, ["numbers", "defaultNumberingSystem"]) as string;
            const symbols = this.getCldrData(locale,
                 ["numbers", "symbols-numberSystem-" + system]) as { [key: string]: string };
            const formatter = this.getGlobalizeInstance(locale).numberFormatter({ style: "decimal" });
            info = {
                decimalSeperator: symbols.decimal,
                formatter,
                groupSeperator: symbols.group,
                minusSign: symbols.minusSign,
                plusSign: symbols.plusSign,
                timeSeparator: ":",
                zeroChar: formatter(0),
            };
            this.numberFormatInfos[locale] = info;
        }
        return info;
    }

    public getCalendar(locale: string, calendarName?: string): ICalendarService {
        if (calendarName) {
            if (calendarName.toLowerCase() !== "gregorian") {
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
        return this.getCldrData(locale, ["posix", "messages", "yesstr"]).split(":")[0];
    }

    public getNoMessage(locale: string): string {
        return this.getCldrData(locale, ["posix", "messages", "nostr"]).split(":")[0];
    }
}