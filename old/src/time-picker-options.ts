import { Input } from "@angular/core";
import { IBaseValueAccessor, ICompositeObject, ITimePickerOptions } from "./interfaces";

function coerceIncrement(val: number): number {
    return val && 60 % val === val ? val : 5;
}

export abstract class TimePickerOptions implements ICompositeObject<ITimePickerOptions>, ITimePickerOptions {
    public parent: IBaseValueAccessor<ITimePickerOptions> & ITimePickerOptions;
    private _minutesIncrement: number = 5;
    private _secondsIncrement: number = 5;
    private _showSeconds: boolean;

    public abstract addBoundChild(child: IBaseValueAccessor<ITimePickerOptions> & ITimePickerOptions): void;

    public abstract removeBoundChild(child: IBaseValueAccessor<ITimePickerOptions> & ITimePickerOptions);

    set minutesIncrement(val: number) {
        if (this.parent) {
            this.parent.minutesIncrement = val;
            return;
        }
        val = coerceIncrement(val);
        if (this._minutesIncrement !== val) {
            this._minutesIncrement = val;
        }
    }

    get minutesIncrement(): number {
        if (this.parent) {
            return this.parent.minutesIncrement;
        }
        return coerceIncrement(this._minutesIncrement);
    }

    @Input() set secondsIncrement(val: number) {
        if (this.parent) {
            this.parent.secondsIncrement = val;
            return;
        }
        val = coerceIncrement(val);
        if (this._secondsIncrement !== val) {
            this._secondsIncrement = val;
        }
    }

    get secondsIncrement(): number {
        if (this.parent) {
            return this.parent.secondsIncrement;
        }
        return coerceIncrement(this._secondsIncrement);
    }

    @Input() set showSeconds(val: boolean) {
        if (this.parent) {
            this.parent.showSeconds = val;
            return;
        }
        if (this._showSeconds !== val) {
            this._showSeconds = val;
        }
    }

    get showSeconds(): boolean {
        if (this.parent) {
            return this.parent.showSeconds;
        }
        return this._showSeconds;
    }

}
