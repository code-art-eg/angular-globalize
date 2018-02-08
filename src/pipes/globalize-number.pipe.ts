import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Pipe, Inject, Injectable, ChangeDetectorRef } from '@angular/core';

import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '../services/globalize.service';
import { CANG_CULTURE_SERVICE, ICultureService } from '../services/current-culture.service';
import { BaseNumericPipe } from './base-globalize-pipe';

@Injectable()
@Pipe({ name: 'gnumber', pure: false })
export class GlobalizeNumberPipe extends BaseNumericPipe<NumberFormatterOptions> {
    
    constructor(@Inject(CANG_GLOBALIZATION_SERVICE) globalizService: IGlobalizationService,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef
        ) {
        super(globalizService, cultureService, changeDetector);
    }

    protected stringToOptions(optionsString: string): NumberFormatterOptions {
        switch(optionsString) {
            case 'decimal':
            case 'percent':
                return {
                    style: optionsString
                };
            case '%':
                return {
                    style: 'percent'
                };
            default:
                throw `Invalid number format '${optionsString}'. Valid values are decimal, percent or %`;
        }
    }

    protected getDefaultOptions(): NumberFormatterOptions {
        return { style: 'decimal' };
    }

    protected convertValue(input: number, locale: string, options: NumberFormatterOptions): string {
        return this.globalizService.formatNumber(input, locale, options);
    }

    protected optionsEqual(o1: NumberFormatterOptions, o2: NumberFormatterOptions): boolean {
        if (!this.commonOptionsEqual(o1, o2)) {
            return false;
        }
        if (!o1) {
            return !o2;
        }
        if (!o2) {
            return false;
        }
        return o1.style === o2.style;
    }
}