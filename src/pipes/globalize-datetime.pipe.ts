import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Pipe, Inject, Injectable, ChangeDetectorRef } from '@angular/core';

import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '../services/globalize.service';
import { CANG_CULTURE_SERVICE, ICultureService } from '../services/current-culture.service';
import { BaseDatePipe } from './base-globalize-pipe';

@Injectable()
@Pipe({ name: 'gdatetime', pure: false })
export class GlobalizeDateTimePipe extends BaseDatePipe {

    constructor(@Inject(CANG_GLOBALIZATION_SERVICE) globalizService: IGlobalizationService,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef
        ) {
        super(globalizService, cultureService, changeDetector);
    }

    protected stringToOptions(optionsString: string): DateFormatterOptions {
        switch(optionsString) {
            case 'short':
            case 'full':
            case 'medium':
            case 'long':
                return {
                    datetime: optionsString
                };
            default:
                if (optionsString.indexOf('raw:') === 0) {
                    return {
                        raw: optionsString.substr(4)
                    }
                }
                return {
                        skeleton: optionsString
                    }
        }
    }
    
    protected getDefaultOptions(): DateFormatterOptions {
        return { 'datetime': 'short' };
    }

    protected convertValue(input: Date, locale: string, options: DateFormatterOptions): string {
        return this.globalizService.formatDate(input, locale, options);
    }
}