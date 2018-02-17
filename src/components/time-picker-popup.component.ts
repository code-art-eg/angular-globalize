import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, Inject, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { datesEqual } from '../util';
import { BaseTimeValueAccessor } from '../base-time-value-accessor';
import { ICultureService, IGlobalizationService, CANG_CULTURE_SERVICE, CANG_GLOBALIZATION_SERVICE } from '@code-art/angular-globalize';
import { TimePickerDirective } from '../directives/time-picker.directive';

@Component({
    templateUrl: './templates/time-picker-popup.component.html',
    styleUrls: ['./styles/popup.less']
})
export class TimePickerPopupComponent extends BaseTimeValueAccessor implements AfterViewInit {
    private _mouseIn = false;
    private _show = false;
    readonly uniqueId: string;
    rangeValue: any = null;
    nonRangeValue: any = null;
    @ViewChild("inputhost") inputHost: ElementRef;
    hostedElement: ElementRef;

    constructor(@Inject(Renderer2) private readonly renderer: Renderer2,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_GLOBALIZATION_SERVICE) globalizeService: IGlobalizationService
    ) {
        super(cultureService, globalizeService);
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
            return (this.parent as TimePickerDirective).orientTop;
        }
        return false;
    }

    get orientRight(): boolean {
        if (this.parent) {
            return (this.parent as TimePickerDirective).orientRight;
        }
        return !this.cultureService.isRightToLeft(this.effectiveLocale);
    }
}