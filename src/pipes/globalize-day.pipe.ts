import { ChangeDetectorRef, Inject, Injectable, Pipe } from "@angular/core";
import { BaseGlobalizePipe } from "./base-globalize-pipe";

import { CANG_CULTURE_SERVICE, ICultureService } from "../services/current-culture.service";
import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from "../services/globalize.service";

export type DayFormat = "abbreviated" | "short" | "narrow" | "wide";

@Injectable()
@Pipe({ name: "gday", pure: false })
export class GlobalizeDayPipe extends BaseGlobalizePipe<number, "abbreviated" | "short" | "narrow" | "wide"> {

    constructor(@Inject(CANG_GLOBALIZATION_SERVICE) globalizService: IGlobalizationService,
                @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
                @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef) {
        super(globalizService, cultureService, changeDetector);
    }

    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }

    protected optionsEqual(o1: DayFormat,
                           o2: DayFormat): boolean {
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
        return this.globalizService.getDayName(input, locale, options);
    }
}
