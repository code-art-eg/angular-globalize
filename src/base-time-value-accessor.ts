import { Input, Inject, ChangeDetectorRef } from "@angular/core";
import { BaseValueAccessor } from "./base-value-accessor";
import { ICultureService, IGlobalizationService } from "@code-art/angular-globalize";


export abstract class BaseTimeValueAccessor extends BaseValueAccessor {

    private static readonly maximumValue = 24 * 3600 * 1000 - 1;
    private static readonly minimumValue = 0;
    private static readonly formats: DateFormatterOptions[] = [{ time: 'short' }, { time: 'medium' }, { time: 'long' }, { time: 'full' }];
    private _rangeSelection: boolean = false;
    private _minTime: number = BaseTimeValueAccessor.maximumValue;
    private _maxTime: number = BaseTimeValueAccessor.minimumValue;
    private _showSeconds = false;
    private _minutesIncrement: number = 5;
    private _secondsIncrement: number = 5;

    constructor(cultureService: ICultureService,
        protected readonly globalizeService: IGlobalizationService, @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef) {
        super(cultureService, changeDetector);
    }

    @Input() set minTime(val: number) {
        if (this.parent) {
            (this.parent as BaseTimeValueAccessor).minTime = val;
            return;
        }
        val = this.coerceValue(val);
        if (this._minTime !== val) {
            this._minTime = val;
        }
    }

    get minTime(): number {
        if (this.parent) {
            return (this.parent as BaseTimeValueAccessor).minTime;
        }
        return this._minTime|| BaseTimeValueAccessor.minimumValue;
    }

    @Input() set maxTime(val: number) {
        if (this.parent) {
            (this.parent as BaseTimeValueAccessor).maxTime = val;
            return;
        }
        val = this.coerceValue(val);
        if (this._maxTime !== val) {
            this._maxTime = val;
        }
    }

    get maxTime(): number {
        if (this.parent) {
            return (this.parent as BaseTimeValueAccessor).maxTime;
        }
        return this._maxTime || BaseTimeValueAccessor.maximumValue;
    }

    @Input() set minutesIncrement(val: number) {
        if (this.parent) {
            (this.parent as BaseTimeValueAccessor).minutesIncrement = val;
            return;
        }
        val = this.coerceIncrement(val);
        if (this._minutesIncrement !== val) {
            this._minutesIncrement = val;
        }
    }

    get minutesIncrement(): number {
        if (this.parent) {
            return (this.parent as BaseTimeValueAccessor).minutesIncrement;
        }
        return this._minutesIncrement || 5;
    }

    @Input() set secondsIncrement(val: number) {
        if (this.parent) {
            (this.parent as BaseTimeValueAccessor).secondsIncrement = val;
            return;
        }
        val = this.coerceIncrement(val);
        if (this._secondsIncrement !== val) {
            this._secondsIncrement = val;
        }
    }

    get secondsIncrement(): number {
        if (this.parent) {
            return (this.parent as BaseTimeValueAccessor).secondsIncrement;
        }
        return this._secondsIncrement || 5;
    }

    @Input() set showSeconds(val: boolean) {
        if (this.parent) {
            (this.parent as BaseTimeValueAccessor).showSeconds = val;
            return;
        }
        val = !!val;
        if (this._showSeconds !== val) {
            this._showSeconds = val;
        }
    }

    get showSeconds(): boolean {
        if (this.parent) {
            return (this.parent as BaseTimeValueAccessor).showSeconds;
        }
        return this._showSeconds;
    }

    coerceIncrement(val: number) : number {
        return val && 60 % val === val ? val : 5;
    }

    coerceValue(val: any): any {
        let d: Date | null = null;
        if (typeof val === 'number') {
            return Math.round(Math.min(BaseTimeValueAccessor.maximumValue, Math.max(BaseTimeValueAccessor.minimumValue, val)));
        } else if (typeof val === 'string') {

            for (let i = 0; i < BaseTimeValueAccessor.formats.length; i++) {
                d = this.globalizeService.parseDate(val, this.effectiveLocale, BaseTimeValueAccessor.formats[i]);
                break;
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