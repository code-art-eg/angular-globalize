import { ComponentRef, ElementRef, ViewContainerRef, Injector, ComponentFactory, OnDestroy, OnInit, EventEmitter, AfterViewInit, Renderer2 } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Observable } from "rxjs/Observable";

import { CANG_CULTURE_SERVICE, ICultureService, CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '@code-art/angular-globalize';
import { BaseValueAccessor } from "./base-value-accessor";


function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

export interface IBaseValueAccessor {
    coerceValue(val: any): any;
    value: any;
    compareValues(v1: any, v2: any);
    cultureService: ICultureService;
    valueChange: EventEmitter<any>;
    disabled: boolean;
    locale: string;
    effectiveLocale: string;
    raiseOnTouch(): void;
    addBoundChild(child: IBaseValueAccessor): void;
}

export interface IPopupComponent extends IBaseValueAccessor {
    hostedElement: ElementRef;
    show: boolean;
    inputHost: ElementRef;
    mouseEnter(): void;
    mouseLeave(): void;
    isVisible: boolean;
    orientRight: boolean;
    orientTop: boolean;
    initPopupComponent(renderer: Renderer2, cultureService: ICultureService): void;
}

export interface IPopupDirective {
    format: string;
    orientRight: boolean;
    orientTop: boolean;
    onFocus(): void;
    onBlur(): void;
    resolveFactory(): ComponentFactory<IPopupComponent>;
    getDefaultFormat(): string;
    initPopupDirective(viewContainerRef: ViewContainerRef, el: ElementRef, injector: Injector);
    formatValue(val: any, locale: string, format: string): string;
}

export abstract class PopupComponent implements IPopupComponent, AfterViewInit {

    private _mouseIn;
    private _renderer: Renderer2;
    private _show: boolean;
    private _cultureService: ICultureService;

    initPopupComponent(renderer: Renderer2, cultureService: ICultureService) : void {
        this._renderer = renderer;
        this._mouseIn = false;
        this._show = false;
        this._cultureService = cultureService;
    }

    inputHost: ElementRef;
    hostedElement: ElementRef;
    parent: IPopupDirective;
    effectiveLocale: string;
    value: any;
    abstract compareValues(v1: any, v2: any);
    cultureService: ICultureService;
    valueChange: EventEmitter<any>;
    disabled: boolean;
    locale: string;
    abstract raiseOnTouch(): void;
    abstract addBoundChild(child: IBaseValueAccessor): void;
    abstract coerceValue(val: any): any;


    ngAfterViewInit(): void {
        let element = this.hostedElement.nativeElement;
        while (element.newNativeElement) {
            element = element.newNativeElement;
        }
        //element.newNativeElement = host;
        this._renderer.appendChild(this.inputHost.nativeElement, element);
    }

    mouseEnter() {
        this._mouseIn = true;
    }

    mouseLeave() {
        setTimeout(() => this._mouseIn = false, 50);
    }

    set show(val: boolean) {
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
        return show;
    }

    get orientTop(): boolean {
        if (this.parent) {
            return (this.parent as IPopupDirective).orientTop;
        }
        return false;
    }

    get orientRight(): boolean {
        if (this.parent) {
            return (this.parent as IPopupDirective).orientRight;
        }
        return !this._cultureService.isRightToLeft(this.effectiveLocale);
    }
}

export abstract class PopupDirective implements OnInit, OnDestroy, IBaseValueAccessor, ControlValueAccessor  {
    private componentRef: ComponentRef<IPopupComponent>;
    private _el: ElementRef;
    private _controlValueAccessor: ControlValueAccessor;
    private _valueChangeSubscription: Subscription;
    private _orientRight: boolean | null;
    private _orientTop: boolean | null;
	private _formatObservable: Observable<string>;
    private _formatSubject: ReplaySubject<string>;
    private _format: string;
    private _injector: Injector
    private _controlValue: any;
    private _viewContainerRef: ViewContainerRef; 

    abstract coerceValue(val: any): any;
    value: any;
    abstract compareValues(v1: any, v2: any);
    abstract cultureService: ICultureService;
    valueChange: EventEmitter<any>;
    disabled: boolean;
    locale: string;
    abstract raiseOnTouch(): void;
    abstract addBoundChild(child: IBaseValueAccessor): void;
    effectiveLocale: string;

    abstract writeValue(val: any): void;
    abstract registerOnChange(fn: any): void;
    abstract registerOnTouched(fn: any): void;

    abstract getDefaultFormat();
    abstract formatValue(val: any, locale: string, format: string): string;
    abstract resolveFactory(): ComponentFactory<IPopupComponent>;

    initPopupDirective(viewContainerRef: ViewContainerRef, el: ElementRef, injector: Injector): void {

        this._viewContainerRef = viewContainerRef;
        this._orientRight = null;
        this._orientTop = null;
        this._injector = injector;
		this._formatSubject = new ReplaySubject();
        this._formatSubject.next(this.getDefaultFormat());
        this._formatObservable = this._formatSubject.asObservable();
        this._controlValue = null;
        this._el = el;
    }
	    
    private selectAccessor(): void {
        let accessors = this._injector.get<ControlValueAccessor | ControlValueAccessor[]>(NG_VALUE_ACCESSOR);
        if (accessors) {
            accessors = Array.isArray(accessors) ? accessors : [accessors];
            for (let i = 0; i < accessors.length; i++) {
                if (accessors[i] !== this) {
                    if (this._controlValueAccessor) {
                        throw `More than one control value accessor is provider.`;
                    }
                    this._controlValueAccessor = accessors[i];
                }
            }
        }
        if (!this._controlValueAccessor) {
            throw `More no control value accessor provider.`;
        }
        this._controlValueAccessor.registerOnChange(v => {
            this._controlValue = v;
            if (this.coerceValue(v)) {
                this.value = v;
            }
        });
        this._valueChangeSubscription = Observable.combineLatest(this.cultureService.cultureObservable, this.valueChange.asObservable(), this._formatObservable).subscribe(v => {
            let [locale, val, f] = v;
            locale = this.locale || locale;
            let coercedValue = this.coerceValue(this._controlValue);
            if (!this.compareValues(coercedValue, val)) {
                this._controlValueAccessor.writeValue(this.formatValue(val, locale, f));
            }
        }) as any as Subscription;
        this._controlValueAccessor.registerOnTouched(() => {
            this.raiseOnTouch();
        });
        if (this._controlValueAccessor && typeof this._controlValueAccessor.setDisabledState === 'function') {
            this._controlValueAccessor.setDisabledState(this.disabled);
        }
    }

    setDisabledState(isDisabled: boolean): void {
        if (this._controlValueAccessor && typeof this._controlValueAccessor.setDisabledState === 'function') {
            this._controlValueAccessor.setDisabledState(isDisabled);
        }
    }

    ngOnInit(): void {
        this.selectAccessor();
        this.createComponent();
    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
        if (this._valueChangeSubscription) {
            this._valueChangeSubscription.unsubscribe();
            this._valueChangeSubscription = null;
        }
        if (this._controlValueAccessor) {
            this._controlValueAccessor.registerOnChange(null);
            this._controlValueAccessor.registerOnTouched(null);
            this._controlValueAccessor = null;
        }
    }

    createComponent(): void {
        let factory = this.resolveFactory();
        this.componentRef = this._viewContainerRef.createComponent(factory);
        this.componentRef.instance.hostedElement = this._el;

        this.addBoundChild(this.componentRef.instance);
    }

    onFocus() {
        this.componentRef.instance.show = true;
    }

    onBlur() {
        this.componentRef.instance.show = false;
    }

    set orientTop(val: boolean) {
        val = !!val;
        if (this._orientRight != val) {
            this._orientTop = val;
        }
    }

    get orientTop(): boolean {
        return this._orientTop;
    }

    set orientRight(val: boolean | null) {
        val = val === false || val === null ? val : !!val;
        if (this._orientRight != val) {
            this._orientRight = val;
        }
    }

    get orientRight(): boolean {
        return this._orientRight === null ? !this.cultureService.isRightToLeft(this.effectiveLocale) : this._orientRight;
    }

    set format(val: string) {
        this._format = val;
        this._formatSubject.next(val);
    }

    get format(): string {
        return this._format;
    }
}