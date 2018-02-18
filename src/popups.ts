import { ElementRef, Injector, ComponentFactory, EventEmitter, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Observable } from "rxjs/Observable";

import { CANG_CULTURE_SERVICE, ICultureService, CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '@code-art/angular-globalize';
import { IBaseValueAccessor } from "./base-value-accessor";

export interface IComponentFocus {
    focus?: boolean;
}

export interface IPopupDirective extends IBaseValueAccessor {
    format: string;
    orientRight: boolean;
    orientTop: boolean;
    onFocus(): void;
    onBlur(): void;
    resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<IBaseValueAccessor>;
    getDefaultFormat(): string;
    initPopupDirective(resolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, el: ElementRef, injector: Injector);
    formatValue(val: any, locale: string, format: string): string;
    parseValue?(val: string): any;
}

export interface IPopupComponent {
    hostedElement: ElementRef;
    show: boolean;
    popupDirective: IPopupDirective;
}