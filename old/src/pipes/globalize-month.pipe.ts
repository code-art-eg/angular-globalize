import { ChangeDetectorRef, Injectable, Pipe, PipeTransform } from "@angular/core";

import { CurrentCultureService } from "../services/current-culture.service";
import { GlobalizationService } from "../services/globalize.service";
import { BaseGlobalizePipe } from "./base-globalize-pipe";

export type MonthFormat = "abbreviated" | "narrow" | "wide";

@Pipe({ name: "gmonth", pure: false })
export class GlobalizeMonthPipe extends BaseGlobalizePipe<number, MonthFormat> implements PipeTransform {

    constructor(globalizeService: GlobalizationService,
                cultureService: CurrentCultureService,
                changeDetector: ChangeDetectorRef) {
        super(globalizeService, cultureService, changeDetector);
    }

    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }

    protected optionsEqual(o1: MonthFormat, o2: MonthFormat): boolean {
        return o1 === o2;
    }

    protected getDefaultOptions(): MonthFormat {
        return "wide";
    }

    protected stringToOptions(optionsString: string): MonthFormat {
        return optionsString as MonthFormat;
    }

    protected convertValue(input: number, locale: string, options: MonthFormat): string {
        return this.globalizeService.getMonthName(input, locale, options);
    }
}
