import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, Inject, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { datesEqual } from '../util';
import { BaseDatePickerAccessor } from '../base-date-picker-accessor';
import { ICultureService, ITypeConverterService, CANG_CULTURE_SERVICE, CANG_TYPE_CONVERTER_SERVICE } from '@code-art/angular-globalize';
import { DatePickerComponent } from './date-picker.component';
import { BaseDatePickerDirective } from '../directives/date-picker.directive';

export abstract class BaseDatePickerPopupComponent extends BaseDatePickerAccessor implements AfterViewInit {
    private _mouseIn = false;
    private _show = false;
    readonly uniqueId: string;
    rangeValue: any = null;
    nonRangeValue: any = null;
    @ViewChild("inputhost") inputHost: ElementRef;
    hostedElement: ElementRef;

    constructor(private readonly renderer: Renderer2,
        cultureService: ICultureService,
        converterService: ITypeConverterService
    ) {
        super(cultureService, converterService);
    }

    ngAfterViewInit(): void {
        let element = this.hostedElement.nativeElement;
        while (element.newNativeElement) {
            element = element.newNativeElement;
        }
        //element.newNativeElement = host;
        this.renderer.appendChild(this.inputHost.nativeElement, element);
    }

    @HostListener('mouseenter') mouseOver() {
        this._mouseIn = true;
    }

    @HostListener('mouseleave') mouseout() {
        setTimeout(() => this._mouseIn = false, 50);
    }

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
        let show = this._show || this._mouseIn;
        //show = true;
        return show;
    }

    get orientTop(): boolean {
        if (this.parent) {
            return (this.parent as BaseDatePickerDirective).orientTop;
        }
        return false;
    }

    get orientRight(): boolean {
        if (this.parent) {
            return (this.parent as BaseDatePickerDirective).orientRight;
        }
        return !this.isRtl;
    }
}

@Component({
    templateUrl: './templates/date-picker-popup.component.html',
    styleUrls: [ './styles/date-picker-popup.component.less']
})
export class DatePickerPopupComponent extends BaseDatePickerPopupComponent {
    constructor(@Inject(Renderer2) renderer: Renderer2,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService
    ) {
        super(renderer, cultureService, converterService);
    }
}

@Component({
    templateUrl: './templates/daterange-picker-popup.component.html',
    styleUrls: ['./styles/date-picker-popup.component.less']
})
export class DateRangePickerPopupComponent extends BaseDatePickerPopupComponent {
    constructor(@Inject(Renderer2) renderer: Renderer2,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService
    ) {
        super(renderer, cultureService, converterService);
    }
}