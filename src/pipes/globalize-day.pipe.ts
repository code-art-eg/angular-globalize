import { BaseGlobalizePipe } from './base-globalize-pipe';
import { Pipe, Inject, Injectable, ChangeDetectorRef } from '@angular/core';

import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '../services/globalize.service';
import { CANG_CULTURE_SERVICE, ICultureService } from '../services/current-culture.service';

type DayFormat = 'abbreviated' | 'short' | 'narrow' | 'wide';

@Injectable()
@Pipe({ name: 'gday', pure: false })
export class GlobalizeDayPipe extends BaseGlobalizePipe<number, 'abbreviated' | 'short' | 'narrow' | 'wide'> {
    
    constructor( @Inject(CANG_GLOBALIZATION_SERVICE) globalizService: IGlobalizationService,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef,
    ) {
        super(globalizService, cultureService, changeDetector);
    }

    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }

    protected optionsEqual(o1: 'abbreviated' | 'short' | 'narrow' | 'wide', o2: 'abbreviated' | 'short' | 'narrow' | 'wide'): boolean {
        return o1 === o2;
    }

    protected getDefaultOptions(): 'abbreviated' | 'short' | 'narrow' | 'wide' {
        return 'wide';
    }

    protected stringToOptions(optionsString: string): 'abbreviated' | 'short' | 'narrow' | 'wide' {
        return optionsString as 'abbreviated' | 'short' | 'narrow' | 'wide';
    }

    protected convertValue(input: number, locale: string, options: 'abbreviated' | 'short' | 'narrow' | 'wide'): string {
        return this.globalizService.getDayName(input, locale, options);
    }
}