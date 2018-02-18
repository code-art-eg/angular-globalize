import { Input, Inject, ChangeDetectorRef } from "@angular/core";
import { BaseValueAccessor } from "./base-value-accessor";
import { ICultureService, IGlobalizationService } from "@code-art/angular-globalize";
import { ITimePicker, ICompositeObject, ITimePickerOptions, IBaseValueAccessor } from "./interfaces";
import { applyMixins } from "./util";

export abstract class TimePickerOptions implements ICompositeObject<ITimePickerOptions>, ITimePickerOptions {

    private _minutesIncrement: number = 5;
    private _secondsIncrement: number = 5;
    private _showSeconds: boolean;

    parent: IBaseValueAccessor<ITimePickerOptions> & ITimePickerOptions;
    abstract addBoundChild(child: IBaseValueAccessor<ITimePickerOptions> & ITimePickerOptions): void;
    abstract removeBoundChild(child: IBaseValueAccessor<ITimePickerOptions> & ITimePickerOptions);

    set minutesIncrement(val: number) {
        if (this.parent) {
            this.parent.minutesIncrement = val;
            return;
        }
        val = this.coerceIncrement(val);
        if (this._minutesIncrement !== val) {
            this._minutesIncrement = val;
        }
    }

    get minutesIncrement(): number {
        if (this.parent) {
            return this.parent.minutesIncrement;
        }
        return this.coerceIncrement(this._minutesIncrement);
    }

    @Input() set secondsIncrement(val: number) {
        if (this.parent) {
            this.parent.secondsIncrement = val;
            return;
        }
        val = this.coerceIncrement(val);
        if (this._secondsIncrement !== val) {
            this._secondsIncrement = val;
        }
    }

    get secondsIncrement(): number {
        if (this.parent) {
            return this.parent.secondsIncrement;
        }
        return this.coerceIncrement(this._secondsIncrement);
    }

    @Input() set showSeconds(val: boolean) {
        if (this.parent) {
            this.parent.showSeconds = val;
            return;
        }
        val = !!val;
        if (this._showSeconds !== val) {
            this._showSeconds = val;
        }
    }

    get showSeconds(): boolean {
        if (this.parent) {
            return this.parent.showSeconds;
        }
        return !!this._showSeconds;
    }

    
    private coerceIncrement(val: number): number {
        return val && 60 % val === val ? val : 5;
    }
}

export abstract class BaseTimeValueAccessor extends BaseValueAccessor<ITimePicker> implements ITimePicker {

    @Input() minutesIncrement: number;
    @Input() secondsIncrement: number;
    @Input() showSeconds: boolean;
    private static readonly maximumValue = 24 * 3600 * 1000 - 1;
    private static readonly minimumValue = 0;
    private static readonly formats: DateFormatterOptions[] = [{ time: 'short' }, { time: 'medium' }, { time: 'long' }, { time: 'full' }];
    private _minTime: number = BaseTimeValueAccessor.maximumValue;
    private _maxTime: number = BaseTimeValueAccessor.minimumValue;
    private _showSeconds = false;
   

    constructor(cultureService: ICultureService,
        protected readonly globalizeService: IGlobalizationService, @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef) {
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
        return this._minTime|| BaseTimeValueAccessor.minimumValue;
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

   

    coerceValue(val: any): any {
        let d: Date | null = null;
        if (typeof val === 'number') {
            return Math.round(Math.min(BaseTimeValueAccessor.maximumValue, Math.max(BaseTimeValueAccessor.minimumValue, val)));
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