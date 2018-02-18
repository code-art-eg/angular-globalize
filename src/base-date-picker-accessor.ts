import { Input, Inject, ChangeDetectorRef } from "@angular/core";
import { ICultureService, ITypeConverterService } from '@code-art/angular-globalize';

import { BaseDateRangeAccessor } from "./base-date-range-accessor";
import { datesEqual, similarInLocal, createDate } from "./util";

export abstract class BaseDatePickerAccessor extends BaseDateRangeAccessor {

    private _homeButton = true;
    private _resetButton = true;
    private _handleKeyboardEvents = false;
    private _todayHighlight = true;
    private _todayDate: Date | null = null;
    private _highlightDays: number = 0;


    constructor(cultureService: ICultureService,
        protected readonly converterService: ITypeConverterService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef) {
        super(cultureService, converterService, changeDetector);
    }

    @Input() set homeButton(val: boolean) {
        if (this.parent) {
            (this.parent as BaseDatePickerAccessor).homeButton = val;
            return;
        }
        val = !!val;
        if (val != this._homeButton) {
            this._homeButton = val;
        }
    }
    
    get homeButton(): boolean {
        if (this.parent) {
            return (this.parent as BaseDatePickerAccessor).homeButton;
        }
        return this._homeButton;
    }

    @Input() set resetButton(val: boolean) {
        if (this.parent) {
            (this.parent as BaseDatePickerAccessor).resetButton = val;
            return;
        }
        val = !!val;
        if (val != this._resetButton) {
            this._resetButton = val;
        }
    }
    
    get resetButton(): boolean {
        if (this.parent) {
            return (this.parent as BaseDatePickerAccessor).resetButton;
        }
        return this._resetButton;
    }

    @Input() set handleKeyboardEvents(val: boolean) {
        if (this.parent) {
            (this.parent as BaseDatePickerAccessor).handleKeyboardEvents = val;
            return;
        }
        val = !!val;
        if (val != this._handleKeyboardEvents) {
            this._handleKeyboardEvents = val;
        }
    }
    
    get handleKeyboardEvents(): boolean {
        if (this.parent) {
            return (this.parent as BaseDatePickerAccessor).handleKeyboardEvents;
        }
        return this._handleKeyboardEvents;
    }

    @Input() set todayHighlight(val: boolean) {
        if (this.parent) {
            (this.parent as BaseDatePickerAccessor).todayHighlight = val;
        }
        val = !!val;
        if (val != this._todayHighlight) {
            this._todayHighlight = val;
        }
    }
    
    get todayHighlight(): boolean {
        if (this.parent) {
            return (this.parent as BaseDatePickerAccessor).todayHighlight;
        }
        return this._todayHighlight;
    }

    @Input() set todayDate(val: Date | null) {
        if (this.parent) {
            (this.parent as BaseDatePickerAccessor).todayDate = val;
            return;
        }
        val = val || null;
        if (!datesEqual(this._todayDate, val)) {
            this._todayDate = val;
        }
    }
    
    get todayDate(): Date | null {
        if (this.parent) {
            return (this.parent as BaseDatePickerAccessor).todayDate;
        }
        if (this._todayDate) {
            return this._todayDate;
        }
        return similarInLocal(createDate());
    }

    @Input() set highlightDays(val: number) {
        if (this.parent) {
            (this.parent as BaseDatePickerAccessor).highlightDays = val;
            return;
        }
        val = val || 0;
        if (val !== this._highlightDays) {
            this._highlightDays = val;
        }
    }
    
    get highlightDays(): number {
        if (this.parent) {
            return (this.parent as BaseDatePickerAccessor).highlightDays;
        }
        return this._highlightDays;
    }
}