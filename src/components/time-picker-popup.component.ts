import { Component, Input, Output, EventEmitter, Renderer2, ElementRef, Inject, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { datesEqual, applyMixins } from '../util';
import { BaseTimeValueAccessor } from '../base-time-value-accessor';
import { ICultureService, IGlobalizationService, CANG_CULTURE_SERVICE, CANG_GLOBALIZATION_SERVICE } from '@code-art/angular-globalize';
import { TimePickerDirective } from '../directives/time-picker.directive';
import { IPopupComponent, PopupComponent } from '../popups';

@Component({
    templateUrl: './templates/time-picker-popup.component.html',
    styleUrls: ['./styles/popup.less']
})
export class TimePickerPopupComponent extends BaseTimeValueAccessor implements IPopupComponent  {

    hostedElement: ElementRef;
    
    @ViewChild("inputhost") inputHost: ElementRef;
    
    constructor(@Inject(Renderer2) renderer: Renderer2,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_GLOBALIZATION_SERVICE) globalizeService: IGlobalizationService
    ) {
        super(cultureService, globalizeService);
        this.initPopupComponent(renderer, cultureService);
    }

    
    @HostListener('mouseenter') mouseEnter: () => void;

    @HostListener('mouseleave') mouseLeave: () => void;

    show: boolean;
    isVisible: boolean;
    orientTop: boolean;
    orientRight: boolean;
    initPopupComponent: (renderer: Renderer2, cultureService: ICultureService) => void;
}

applyMixins(TimePickerPopupComponent, PopupComponent);