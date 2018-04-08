import { ChangeDetectorRef, Inject, Injectable, Pipe } from "@angular/core";
import { BaseGlobalizePipe } from "./base-globalize-pipe";

import { CANG_CULTURE_SERVICE, ICultureService } from "../services/current-culture.service";
import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from "../services/globalize.service";

export type MonthFormat = "abbreviated" | "narrow" | "wide";

@Injectable()
@Pipe({ name: "gmonth", pure: false })
export class GlobalizeMonthPipe extends BaseGlobalizePipe<number, MonthFormat> {

     constructor(@Inject(CANG_GLOBALIZATION_SERVICE) globalizService: IGlobalizationService,
                 @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
                 @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef,
        ) {
        super(globalizService, cultureService, changeDetector);
    }

    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }

    protected optionsEqual(o1: MonthFormat , o2: MonthFormat): boolean {
        return o1 === o2;
    }

    protected getDefaultOptions(): MonthFormat {
        return "wide";
    }

    protected stringToOptions(optionsString: string): MonthFormat {
        return optionsString as MonthFormat;
    }

    protected convertValue(input: number, locale: string, options: MonthFormat): string {
        return this.globalizService.getMonthName(input, locale, options);
    }
}
