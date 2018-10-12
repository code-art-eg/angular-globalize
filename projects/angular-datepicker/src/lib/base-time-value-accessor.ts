import { ChangeDetectorRef, Inject, Input } from '@angular/core';
import { DateFormatterOptions } from 'globalize';
import { CurrentCultureService, GlobalizationService } from '@code-art/angular-globalize';

import { BaseValueAccessor } from './base-value-accessor';
import { ITimePicker } from './interfaces';
import { TimePickerOptions } from './time-picker-options';
import { applyMixins } from './util';

export abstract class BaseTimeValueAccessor extends BaseValueAccessor<ITimePicker> implements ITimePicker {
    private static readonly maximumValue = 24 * 3600 * 1000 - 1;
    private static readonly minimumValue = 0;
    private static readonly formats: DateFormatterOptions[] =
        [{ time: 'short' }, { time: 'medium' }, { time: 'long' }, { time: 'full' }];

    @Input() public minutesIncrement: number;
    @Input() public secondsIncrement: number;
    @Input() public showSeconds: boolean;
    private _minTime: number = BaseTimeValueAccessor.maximumValue;
    private _maxTime: number = BaseTimeValueAccessor.minimumValue;
    constructor(cultureService: CurrentCultureService,
                protected readonly globalizeService: GlobalizationService,
                @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef) {
        super(cultureService, changeDetector);
    }

    @Input() set minTime(val: number) {
        if (this.parent) {
            this.parent.minTime = val;
            return;
        }
        val = this.coerceValue(val);
        if (this._minTime !== val) {
            this._minTime = val;
        }
    }

    get minTime(): number {
        if (this.parent) {
            return this.parent.minTime;
        }
        return this._minTime || BaseTimeValueAccessor.minimumValue;
    }

    @Input() set maxTime(val: number) {
        if (this.parent) {
            this.parent.maxTime = val;
            return;
        }
        val = this.coerceValue(val);
        if (this._maxTime !== val) {
            this._maxTime = val;
        }
    }

    get maxTime(): number {
        if (this.parent) {
            return this.parent.maxTime;
        }
        return this._maxTime || BaseTimeValueAccessor.maximumValue;
    }

    public coerceValue(val: any): any {
        let d: Date | null = null;
        if (typeof val === 'number') {
            return Math.round(Math.min(BaseTimeValueAccessor.maximumValue,
                Math.max(BaseTimeValueAccessor.minimumValue, val)));
        } else if (typeof val === 'string') {

            for (let i = 0; i < BaseTimeValueAccessor.formats.length; i++) {
                d = this.globalizeService.parseDate(val, this.effectiveLocale, BaseTimeValueAccessor.formats[i]);
                if (d) {
                    break;
                }
            }
        } else if (val instanceof Date) {
            d = val;
        }
        if (d !== null) {
            return 1000 * (d.getSeconds() + (d.getMinutes() + d.getHours() * 60) * 60);
        }
        return null;
    }
}

applyMixins(BaseTimeValueAccessor, TimePickerOptions);
