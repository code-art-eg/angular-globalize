import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Pipe, Inject, Injectable, ChangeDetectorRef } from '@angular/core';

import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '../services/globalize.service';
import { CANG_CULTURE_SERVICE, ICultureService } from '../services/current-culture.service';
import { BaseNumericPipe } from './base-globalize-pipe';
import { DurationFormatOptions } from '../services/globalize.service';

@Injectable()
@Pipe({ name: 'gduration', pure: false })
export class GlobalizeDurationPipe extends BaseNumericPipe<DurationFormatOptions> {

    constructor(@Inject(CANG_GLOBALIZATION_SERVICE) globalizService: IGlobalizationService,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef
    ) {
        super(globalizService, cultureService, changeDetector);
    }

    protected stringToOptions(optionsString: string): DurationFormatOptions {
        switch (optionsString) {
            case 'constant':
            case 'short':
            case 'long':
                return {
                    style: optionsString
                };
            default:
                return {
                    pattern: optionsString
                };
        }
    }

    protected optionsEqual(o1: DurationFormatOptions, o2: DurationFormatOptions): boolean {
        if (!o1) {
            return !o2;
        }
        if (!o2)
            return false;
        return o1.pattern === o2.pattern && o1.style === o2.style;
    }

    protected getDefaultOptions(): DurationFormatOptions {
        return { style: 'short' };
    }

    protected convertValue(input: number, locale: string, options: DurationFormatOptions): string {
        return this.globalizService.formatDuration(input, locale, options);
    }
}