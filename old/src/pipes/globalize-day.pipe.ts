import { ChangeDetectorRef, Injectable, Pipe, PipeTransform } from "@angular/core";

import { CurrentCultureService } from "../services/current-culture.service";
import { GlobalizationService } from "../services/globalize.service";
import { BaseGlobalizePipe } from "./base-globalize-pipe";

export type DayFormat = "abbreviated" | "short" | "narrow" | "wide";

@Pipe({ name: "gday", pure: false })
export class GlobalizeDayPipe extends BaseGlobalizePipe<number, DayFormat> implements PipeTransform {

    constructor(globalizeService: GlobalizationService,
                cultureService: CurrentCultureService,
                changeDetector: ChangeDetectorRef) {
        super(globalizeService, cultureService, changeDetector);
    }

    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }

    protected optionsEqual(o1: DayFormat, o2: DayFormat): boolean {
        return o1 === o2;
    }

    protected getDefaultOptions(): DayFormat {
        return "wide";
    }

    protected stringToOptions(optionsString: string): DayFormat {
        return optionsString as DayFormat;
    }

    protected convertValue(input: number,
                           locale: string,
                           options: DayFormat): string {
        return this.globalizeService.getDayName(input, locale, options);
    }
}
