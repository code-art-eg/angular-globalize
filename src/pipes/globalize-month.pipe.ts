import { BaseGlobalizePipe } from './base-globalize-pipe';
import { Pipe, Inject, Injectable, ChangeDetectorRef } from '@angular/core';

import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '../services/globalize.service';
import { CANG_CULTURE_SERVICE, ICultureService } from '../services/current-culture.service';

type MonthFormat = 'abbreviated' | 'narrow' | 'wide';

@Injectable()
@Pipe({ name: 'gmonth', pure: false })
export class GlobalizeMonthPipe extends BaseGlobalizePipe<number, 'abbreviated' | 'narrow' | 'wide'> {
    
     constructor(@Inject(CANG_GLOBALIZATION_SERVICE) globalizService: IGlobalizationService,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef,
        ) {
        super(globalizService, cultureService, changeDetector);
    }

    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }

    protected optionsEqual(o1: 'abbreviated' | 'narrow' | 'wide' , o2: 'abbreviated' | 'narrow' | 'wide'): boolean {
        return o1 === o2;
    }

    protected getDefaultOptions(): 'abbreviated' | 'narrow' | 'wide' {
        return 'wide';
    }

    protected stringToOptions(optionsString: string): 'abbreviated' | 'narrow' | 'wide' {
        return optionsString as 'abbreviated' | 'narrow' | 'wide';
    }

    protected convertValue(input: number, locale: string, options: 'abbreviated' | 'narrow' | 'wide'): string {
        return this.globalizService.getMonthName(input, locale, options);
    }
}