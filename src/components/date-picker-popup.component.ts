import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, Inject, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { datesEqual } from '../util';
import { BaseDatePickerAccessor } from '../base-date-picker-accessor';
import { ICultureService, ITypeConverterService, CANG_CULTURE_SERVICE, CANG_TYPE_CONVERTER_SERVICE } from '@code-art/angular-globalize';
import { DatePickerComponent } from './date-picker.component';
import { DatePickerDirective } from '../directives/date-picker.directive';

@Component({
    templateUrl: './date-picker-popup.component.html',
    styleUrls: [ './date-picker-popup.component.less']
})
export class DatePickerPopupComponent extends BaseDatePickerAccessor {
    constructor(@Inject(Renderer2) readonly renderer: Renderer2,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService
    ) {
        super(cultureService, converterService);
        
    }

    @HostListener('mouseenter') mouseOver() {
        this._mouseIn = true;
    }

    @HostListener('mouseleave') mouseout() {
        setTimeout(() => this._mouseIn = false, 50);
    }

    private _mouseIn = false;
    private _show = false;
    @Input() set show(val: boolean) {
        val = !!val;
        if (this._show !== val) {
            this._show = val;
        }
    }

    get show(): boolean {
        return this.show;
    }

    get isVisible(): boolean {
        const show = this._show || this._mouseIn;
        //const show = true;
        return show;
    }

    get orientTop(): boolean {
        if (this.parent) {
            return (this.parent as DatePickerDirective).orientTop;
        }
        return false;
    }
   
    get orientRight(): boolean {
        if (this.parent) {
            return (this.parent as DatePickerDirective).orientRight;
        }
        return !this.isRtl;
    }
}