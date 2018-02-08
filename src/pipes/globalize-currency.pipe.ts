import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Pipe, Inject, Injectable, ChangeDetectorRef, WrappedValue } from '@angular/core';

import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '../services/globalize.service';
import { CANG_CULTURE_SERVICE, ICultureService } from '../services/current-culture.service';
import { BaseNumericPipe } from './base-globalize-pipe';

@Injectable()
@Pipe({ name: 'gcurrency', pure: false })
export class GlobalizeCurrencyPipe extends BaseNumericPipe<CurrencyFormatterOptions> {

    constructor( @Inject(CANG_GLOBALIZATION_SERVICE) globalizService: IGlobalizationService,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef
        ) {
        super(globalizService, cultureService, changeDetector);
    }
    private currency: string;

    transform(input: null, currency: string, localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined, optionsOrFormat?: CurrencyFormatterOptions | string | undefined): null;
    transform(input: undefined, currency: string, localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined, optionsOrFormat?: CurrencyFormatterOptions | string | undefined): undefined;
    transform(input: number, currency: string,
        localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined,
        optionsOrFormat?: CurrencyFormatterOptions | string | undefined): string;
    transform(input: Observable<number>, currency: string, localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined, optionsOrFormat?: CurrencyFormatterOptions | string): string;
    transform(input: number | Observable<number> | null | undefined, currency: string, localeOrOptionsOrFormat?: CurrencyFormatterOptions | string | undefined, optionsOrFormat?: CurrencyFormatterOptions | string | undefined): string | null | undefined | WrappedValue {
        this.currency = currency;
        return this.doTransform(input, localeOrOptionsOrFormat, optionsOrFormat);
    }

    protected stringToOptions(optionsString: string): CurrencyFormatterOptions {

        switch (optionsString) {
            case 'symbol':
            case 'name':
            case 'code':
            case 'accounting':
                return {
                    style: optionsString
                };
            default:
                throw `Invalid number format '${optionsString}'. Valid values are symbol, accounting, name or code`;
        }
    }

    protected getDefaultOptions(): CurrencyFormatterOptions {
        return { style: 'symbol' };
    }

    protected convertValue(input: number, locale: string, options: CurrencyFormatterOptions): string {
        return this.globalizService.formatCurrency(input, this.currency, locale, options);
    }

    protected optionsEqual(o1: CurrencyFormatterOptions, o2: CurrencyFormatterOptions): boolean {
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