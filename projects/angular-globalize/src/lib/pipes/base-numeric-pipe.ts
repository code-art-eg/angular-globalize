import { Injectable } from '@angular/core';

import { CommonNumberFormatterOptions } from 'globalize';

import { BaseGlobalizePipe } from './base-globalize-pipe';

@Injectable()
export abstract class BaseNumericPipe<TOptions> extends BaseGlobalizePipe<number, TOptions> {
    protected static commonOptionsEqual(o1: CommonNumberFormatterOptions, o2: CommonNumberFormatterOptions): boolean {
        return o1.maximumFractionDigits === o2.maximumFractionDigits
            && o1.maximumSignificantDigits === o2.maximumSignificantDigits
            && o1.minimumFractionDigits === o2.minimumFractionDigits
            && o1.minimumIntegerDigits === o2.minimumIntegerDigits
            && o1.minimumSignificantDigits === o2.minimumSignificantDigits
            && o1.round === o2.round
            && o1.useGrouping === o2.useGrouping;
    }

    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }
}
