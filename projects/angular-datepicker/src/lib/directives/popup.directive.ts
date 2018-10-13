import {
    ComponentFactory, ComponentFactoryResolver, ComponentRef,
    ElementRef, EventEmitter, Injector, OnDestroy, OnInit, ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrentCultureService } from '@code-art/angular-globalize';
import { combineLatest, Observable, ReplaySubject, Subscription } from 'rxjs';
import { PopupComponent } from '../components/popup/popup.component';
import { IBaseValueAccessor, IPopupComponent, IPopupDirective } from '../interfaces';

export abstract class PopupDirective<T> implements OnInit, OnDestroy, IPopupDirective<T> {
    public parent: IBaseValueAccessor<T> & T;
    public value: any;
    public valueChange: EventEmitter<any>;
    public disabled: boolean;
    public locale: string;
    public effectiveLocale: string;
    public parseValue: (val: string) => any;
    public cultureService: CurrentCultureService;

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
    private _injector: Injector;
    private _controlValue: any;
    private _resolver: ComponentFactoryResolver;

    public abstract resolveFactory(): ComponentFactory<IBaseValueAccessor<T>>;

    public abstract coerceValue(val: any): any;

    public abstract compareValues(v1: any, v2: any);

    public abstract raiseOnTouch(): void;

    public abstract raiseOnChange(val: any): void;

    public abstract addBoundChild(child: IBaseValueAccessor<T> & T): void;

    public abstract removeBoundChild(child: IBaseValueAccessor<T> & T): void;

    public abstract writeValue(val: any): void;

    public abstract registerOnChange(fn: any): void;

    public abstract registerOnTouched(fn: any): void;

    public abstract getDefaultFormat();

    public abstract formatValue(val: any, locale: string, format: string): string;

    public initPopupDirective(resolver: ComponentFactoryResolver,
                              viewContainerRef: ViewContainerRef,
                              el: ElementRef, injector: Injector): void {
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

    public setDisabledState(isDisabled: boolean): void {
        if (this._controlValueAccessor && typeof this._controlValueAccessor.setDisabledState === 'function') {
            this._controlValueAccessor.setDisabledState(isDisabled);
        }
    }

    public ngOnInit(): void {
        this.selectAccessor();
        this.createComponent();
    }

    public ngOnDestroy(): void {
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

    public createComponent(): void {
        const factory = this._resolver.resolveComponentFactory<IPopupComponent<T>>(PopupComponent);
        this.componentRef = this._viewContainerRef.createComponent(factory);
        this.componentRef.instance.hostedElement = this._el;
        this.componentRef.instance.popupDirective = this;
    }

    public onFocus() {
        if (this.componentRef && this.componentRef.instance) {
            this.componentRef.instance.show = true;
        }
    }

    public onBlur() {
        if (this.componentRef && this.componentRef.instance) {
            this.componentRef.instance.show = false;
        }
    }

    set orientTop(val: boolean) {
        if (this._orientTop !== val) {
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
                    if (typeof winHeight === 'number'
                        && rect && typeof (rect.top) === 'number' && typeof (rect.bottom) === 'number') {
                        return rect.top > winHeight - rect.bottom;
                    }
                }
            }
        }
        return false;
    }

    set orientRight(val: boolean | null) {
        if (this._orientRight !== val) {
            this._orientRight = val;
        }
    }

    get orientRight(): boolean {
        return this._orientRight === null ?
            !this.cultureService.isRightToLeft(this.effectiveLocale) : this._orientRight;
    }

    set format(val: string) {
        this._format = val;
        this._formatSubject.next(val);
    }

    get format(): string {
        return this._format;
    }

    private selectAccessor(): void {
        let accessors = this._injector.get<ControlValueAccessor | ControlValueAccessor[]>(NG_VALUE_ACCESSOR);
        if (accessors) {
            accessors = Array.isArray(accessors) ? accessors : [accessors];
            for (let i = 0; i < accessors.length; i++) {
                if (accessors[i] !== this) {
                    if (this._controlValueAccessor) {
                        throw new Error(`More than one control value accessor is provider.`);
                    }
                    this._controlValueAccessor = accessors[i];
                }
            }
        }
        if (!this._controlValueAccessor) {
            throw new Error(`No ControlValueAccessor available for the control. `
                + `Make sure FormsModule from @angular/forms is imported in your application.`);
        }
        this._controlValueAccessor.registerOnChange((v) => {
            this._controlValue = v;
            if (v === null || v === undefined || /^\s*$/.test(v)) {
                v = null;
            }
            const val = v === null ? null : typeof this.parseValue === 'function' ? this.parseValue(v) : v;
            const coercedValue = val === null ? val : this.coerceValue(val);
            if (v !== null) {
                if (coercedValue) {
                    this.value = val;
                } else {
                    this.raiseOnChange(v);
                }
            } else {
                this.value = null;
            }
        });
        this._valueChangeSubscription = combineLatest(this.cultureService.cultureObservable,
            this.valueChange.asObservable(), this._formatObservable).subscribe((v) => {
                const [l, val, f] = v;
                if (typeof val === 'string') {
                    this._controlValueAccessor.writeValue(val);
                } else {
                    const locale = this.locale || l;
                    const coercedValue = this.coerceValue(this._controlValue);
                    if (!this.compareValues(coercedValue, val)) {
                        this._controlValueAccessor.writeValue(this.formatValue(val, locale, f));
                    }
                }
        }) as any as Subscription;
        this._controlValueAccessor.registerOnTouched(() => {
            this.raiseOnTouch();
        });
        if (this._controlValueAccessor && typeof this._controlValueAccessor.setDisabledState === 'function') {
            this._controlValueAccessor.setDisabledState(this.disabled);
        }
    }
}
