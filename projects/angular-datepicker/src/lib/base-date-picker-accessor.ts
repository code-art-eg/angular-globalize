import { BaseDateRangeAccessor } from './base-date-range-accessor';
import { IDatePicker } from './interfaces';
import { createDate, datesEqual, similarInLocal } from './util';
import { Input } from '@angular/core';

export abstract class BaseDatePickerAccessor<T extends IDatePicker>
    extends BaseDateRangeAccessor<IDatePicker> implements IDatePicker {

    private _homeButton = true;
    private _resetButton = true;
    private _handleKeyboardEvents = false;
    private _todayHighlight = true;
    private _todayDate: Date | null = null;
    private _highlightDays = 0;

    @Input() set homeButton(val: boolean) {
        if (this.parent) {
            this.parent.homeButton = val;
            return;
        }
        if (val !== this._homeButton) {
            this._homeButton = val;
        }
    }

    get homeButton(): boolean {
        if (this.parent) {
            return this.parent.homeButton;
        }
        return this._homeButton;
    }

    @Input() set resetButton(val: boolean) {
        if (this.parent) {
            this.parent.resetButton = val;
            return;
        }
        if (val !== this._resetButton) {
            this._resetButton = val;
        }
    }

    get resetButton(): boolean {
        if (this.parent) {
            return this.parent.resetButton;
        }
        return this._resetButton;
    }

    @Input() set handleKeyboardEvents(val: boolean) {
        if (this.parent) {
            this.parent.handleKeyboardEvents = val;
            return;
        }
        if (val !== this._handleKeyboardEvents) {
            this._handleKeyboardEvents = val;
        }
    }

    get handleKeyboardEvents(): boolean {
        if (this.parent) {
            return this.parent.handleKeyboardEvents;
        }
        return this._handleKeyboardEvents;
    }

    @Input() set todayHighlight(val: boolean) {
        if (this.parent) {
            this.parent.todayHighlight = val;
        }
        if (val !== this._todayHighlight) {
            this._todayHighlight = val;
        }
    }

    get todayHighlight(): boolean {
        if (this.parent) {
            return this.parent.todayHighlight;
        }
        return this._todayHighlight;
    }

    @Input() set todayDate(val: Date | null) {
        if (this.parent) {
            this.parent.todayDate = val;
            return;
        }
        val = val || null;
        if (!datesEqual(this._todayDate, val)) {
            this._todayDate = val;
        }
    }

    get todayDate(): Date | null {
        if (this.parent) {
            return this.parent.todayDate;
        }
        if (this._todayDate) {
            return this._todayDate;
        }
        return similarInLocal(createDate());
    }

    @Input() set highlightDays(val: number) {
        if (this.parent) {
            this.parent.highlightDays = val;
            return;
        }
        val = val || 0;
        if (val !== this._highlightDays) {
            this._highlightDays = val;
        }
    }

    get highlightDays(): number {
        if (this.parent) {
            return this.parent.highlightDays;
        }
        return this._highlightDays;
    }
}
