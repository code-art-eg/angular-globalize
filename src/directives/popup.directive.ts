import { Subscription } from "rxjs/Subscription";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Observable } from "rxjs/Observable";
import { OnInit, OnDestroy, ComponentRef, ElementRef, Injector, EventEmitter, ComponentFactory, ViewContainerRef, ComponentFactoryResolver, Directive } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ICultureService } from "@code-art/angular-globalize";
import { PopupComponent } from "../components/popup.component";
import { BaseValueAccessor } from "../base-value-accessor";
import { IBaseValueAccessor, IPopupDirective, IPopupComponent } from "../interfaces";


export abstract class PopupDirective<T> implements OnInit, OnDestroy, IPopupDirective<T> {
    private componentRef: ComponentRef<IPopupComponent<T>>;
    private _el: ElementRef;
    private _controlValueAccessor: ControlValueAccessor;
    private _viewContainerRef: ViewContainerRef;
    private _valueChangeSubscription: Subscription;
    private _orientRight: boolean | null;
    private _orientTop: boolean | null;
    private _formatObservable: Observable<string>;
    private _formatSubject: ReplaySubject<string>;
    private _format: string;
    private _injector: Injector
    private _controlValue: any;
    private _resolver: ComponentFactoryResolver;
    
    parent: IBaseValueAccessor<T> & T;
    abstract coerceValue(val: any): any;
    value: any;
    abstract compareValues(v1: any, v2: any);
    abstract cultureService: ICultureService;
    valueChange: EventEmitter<any>;
    disabled: boolean;
    locale: string;
    abstract raiseOnTouch(): void;
    abstract addBoundChild(child: IBaseValueAccessor<T> & T): void;
    abstract removeBoundChild(child: IBaseValueAccessor<T> & T): void;
    effectiveLocale: string;

    abstract writeValue(val: any): void;
    abstract registerOnChange(fn: any): void;
    abstract registerOnTouched(fn: any): void;

    abstract getDefaultFormat();
    abstract formatValue(val: any, locale: string, format: string): string;
    parseValue: (val: string) => any;
    abstract resolveFactory(): ComponentFactory<IBaseValueAccessor<T>>;
    
    initPopupDirective(resolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, el: ElementRef, injector: Injector): void {
        this._viewContainerRef = viewContainerRef;
        this._orientRight = null;
        this._orientTop = null;
        this._injector = injector;
        this._formatSubject = new ReplaySubject();
        this._formatSubject.next(this.getDefaultFormat());
        this._formatObservable = this._formatSubject.asObservable();
        this._controlValue = null;
        this._el = el;
        this._resolver = resolver;
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
            throw `No ControlValueAccessor available for the control. Make sure FormsModule from @angular/forms is imported in your application.`;
        }
        this._controlValueAccessor.registerOnChange(v => {
            this._controlValue = v;
            const val = typeof this.parseValue === 'function' ? this.parseValue(v) : v;
            if (this.coerceValue(val)) {
                this.value = val;
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
        let factory = this._resolver.resolveComponentFactory<IPopupComponent<T>>(PopupComponent);
        this.componentRef = this._viewContainerRef.createComponent(factory);
        this.componentRef.instance.hostedElement = this._el;
        this.componentRef.instance.popupDirective = this;
    }

    onFocus() {
        this.componentRef.instance.show = true;
    }

    onBlur() {
        this.componentRef.instance.show = false;
    }

    set orientTop(val: boolean) {
        val = !!val;
        if (this._orientTop != val) {
            this._orientTop = val;
        }
    }

    get orientTop(): boolean {
        if (this._orientTop === null) {
            if (this._el && this._el.nativeElement) {
                const htmlEl = this._el.nativeElement as HTMLElement;
                if (typeof htmlEl.getBoundingClientRect === 'function' && window) {
                    const rect = htmlEl.getBoundingClientRect();
                    const winHeight = window.innerHeight;
                    if (typeof winHeight === 'number' && rect && typeof (rect.top) === 'number' && typeof (rect.bottom) === 'number') {
                        return rect.top > winHeight - rect.bottom;
                    }
                }
            }
        }
        return false;
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