import { ChangeDetectorRef, ComponentFactory,
    ComponentFactoryResolver, ElementRef,
    EventEmitter, Injector, ViewContainerRef } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

import { ICultureService} from "@code-art/angular-globalize";

export interface IComponentFocus {
    focus?: boolean;
}

export interface ICompositeObject<T> {
    parent: IBaseValueAccessor<T> & T;
    addBoundChild(child: IBaseValueAccessor<T> & T): void;
    removeBoundChild(child: IBaseValueAccessor<T> & T);
}

export interface IBaseValueAccessor<T> extends ControlValueAccessor, ICompositeObject<T> {
    value: any;
    cultureService: ICultureService;
    valueChange: EventEmitter<any>;
    disabled: boolean;
    locale: string;
    effectiveLocale: string;
    changeDetector?: ChangeDetectorRef;
    coerceValue(val: any): any;
    compareValues(v1: any, v2: any);
    raiseOnTouch(): void;
}

export interface IPopupDirective<T> extends IBaseValueAccessor<T>  {
    format: string;
    orientRight: boolean;
    orientTop: boolean;
    resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<IBaseValueAccessor<T>>;
    getDefaultFormat(): string;
    initPopupDirective(resolver: ComponentFactoryResolver,
                       viewContainerRef: ViewContainerRef,
                       el: ElementRef,
                       injector: Injector);
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
