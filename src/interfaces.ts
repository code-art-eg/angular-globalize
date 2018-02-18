import { ElementRef, Injector, ComponentFactory, EventEmitter, ViewContainerRef, ComponentFactoryResolver, ChangeDetectorRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Observable } from "rxjs/Observable";

import { CANG_CULTURE_SERVICE, ICultureService, CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '@code-art/angular-globalize';

export interface IComponentFocus {
    focus?: boolean;
}

export interface ICompositeObject<T> {
    addBoundChild(child: IBaseValueAccessor<T> & T): void;
    parent: IBaseValueAccessor<T> & T;
    removeBoundChild(child: IBaseValueAccessor<T> & T);
}

export interface IBaseValueAccessor<T> extends ControlValueAccessor, ICompositeObject<T> {
    coerceValue(val: any): any;
    value: any;
    compareValues(v1: any, v2: any);
    cultureService: ICultureService;
    valueChange: EventEmitter<any>;
    disabled: boolean;
    locale: string;
    effectiveLocale: string;
    raiseOnTouch(): void;
    changeDetector?: ChangeDetectorRef;
}

export interface IPopupDirective<T> extends IBaseValueAccessor<T>  {
    format: string;
    orientRight: boolean;
    orientTop: boolean;
    resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<IBaseValueAccessor<T>>;
    getDefaultFormat(): string;
    initPopupDirective(resolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, el: ElementRef, injector: Injector);
    formatValue(val: any, locale: string, format: string): string;
    parseValue?(val: string): any;
}

export interface IPopupComponent<T> {
    hostedElement: ElementRef;
    show: boolean;
    popupDirective: IPopupDirective<T>;
}

export interface IDateRangeOptions {
    rangeSelection: boolean;
    minDate: Date;
    maxDate: Date;
    selectionStart: Date | null;
    selectionEnd: Date | null;
}

export interface IDatePicker extends IDateRangeOptions {
    homeButton: boolean;
    resetButton: boolean;
    handleKeyboardEvents: boolean;
    todayHighlight: boolean;
    todayDate: Date;
    highlightDays: number;
}

export interface ITimePickerOptions {
    minutesIncrement: number;
    secondsIncrement: number;
    showSeconds: boolean;
}

export interface ITimePickerMaxMinValues {
    maxTime: number;
    minTime: number;
}

export interface ITimePicker extends ITimePickerOptions, ITimePickerMaxMinValues {

}

export interface IDateTimePicker extends IDatePicker, ITimePickerOptions {

}