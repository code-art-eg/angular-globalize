import { ChangeDetectorRef, Injectable, Pipe, PipeTransform } from "@angular/core";

import { CurrentCultureService } from "../services/current-culture.service";
import { GlobalizationService } from "../services/globalize.service";
import { DurationFormatOptions } from "../services/services-common";
import { BaseNumericPipe } from "./base-numeric-pipe";

@Pipe({ name: "gduration", pure: false })
export class GlobalizeDurationPipe extends BaseNumericPipe<DurationFormatOptions> implements PipeTransform {

    constructor(globalizeService: GlobalizationService,
                cultureService: CurrentCultureService,
                changeDetector: ChangeDetectorRef) {
        super(globalizeService, cultureService, changeDetector);
    }

    protected stringToOptions(optionsString: string): DurationFormatOptions {
        switch (optionsString) {
            case "constant":
            case "short":
            case "long":
                return {
                    style: optionsString,
                };
            default:
                return {
                    pattern: optionsString,
                };
        }
    }

    protected optionsEqual(o1: DurationFormatOptions, o2: DurationFormatOptions): boolean {
        if (!o1) {
            return !o2;
        }
        if (!o2) {
            return false;
        }
        return o1.pattern === o2.pattern && o1.style === o2.style;
    }

    protected getDefaultOptions(): DurationFormatOptions {
        return { style: "short" };
    }

    protected convertValue(input: number, locale: string, options: DurationFormatOptions): string {
        return this.globalizeService.formatDuration(input, locale, options);
    }
}
