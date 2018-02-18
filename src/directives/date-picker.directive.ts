import { Directive, ComponentFactoryResolver, ViewContainerRef, OnInit, Inject, ComponentRef, HostListener, Input, OnDestroy, forwardRef, ElementRef, Optional, Self, Injector , ComponentFactory, AfterViewInit} from '@angular/core';
import { DatePickerPopupComponent, DateRangePickerPopupComponent, BaseDatePickerPopupComponent } from '../components/date-picker-popup.component';
import { datesEqual, IDateRange } from '../util';
import { CANG_TYPE_CONVERTER_SERVICE, ITypeConverterService, CANG_CULTURE_SERVICE, ICultureService, CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '@code-art/angular-globalize';
import { BaseDatePickerAccessor } from '../base-date-picker-accessor';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, DefaultValueAccessor, } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/combineLatest';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as isPlainObject from 'is-plain-object';


export abstract class BaseDatePickerDirective extends BaseDatePickerAccessor implements OnInit, OnDestroy {

    private componentRef: ComponentRef<BaseDatePickerPopupComponent>;
    private _orientRight: boolean | null = null;
    private _orientTop = false;
    private _controlValueAccessor: ControlValueAccessor = null;
    private _valueChangeSubscription: Subscription;
    private _controlValue: any = null;
    private _format: string = 'short';
    private readonly _formatObservable: Observable<string>;
    private readonly _formatSubject: ReplaySubject<string>;

    constructor(protected readonly resolver: ComponentFactoryResolver,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly el: ElementRef,
        converterService: ITypeConverterService,
        cultureService: ICultureService,
        private readonly globalizationService: IGlobalizationService,
        private readonly injector: Injector
    ) {
        super(cultureService, converterService);
        this.handleKeyboardEvents = true;
        this._formatSubject = new ReplaySubject();
        this._formatSubject.next(this._format);
        this._formatObservable = this._formatSubject.asObservable();
    }

    private formatDate(val: Date, locale: string, format: string) {
        format = format || 'short';
        let options: DateFormatterOptions;
        switch (format) {
            case 'short':
            case 'medium':
            case 'long':
            case 'full':
                options = { date: format }
                break;
            default:
                if (format.indexOf('raw:')) {
                    options = { raw: format.substr(4) };
                } else {
                    options = { skeleton: format };
                }
                break;
        }
        return this.globalizationService.formatDate(val, locale, options);
    }

    private formatValue(val: any, locale: string, format: string): string {
        if (val === undefined || val === null) {
            return '';
        }
        if (val instanceof Date) {
            return this.formatDate(val, locale, format);
        } else if (isPlainObject(val)) {
            var from: any = val.from;
            if (from instanceof Date) {
                from = this.formatDate(from, locale, format);
            } else {
                from = null;
            }

            var to: any = val.to;
            if (to instanceof Date) {
                to = this.formatDate(to, locale, format);
            } else {
                to = null;
            }

            if (!from) {
                if (!to) return '';
                return to;
            } else {
                if (!to) return from;
                return `${from} - ${to}`;
            }
        }
        return '';
    }

    private parseValue(val: any): any {
        if (typeof val !== 'string') {
            return val;
        }
        const index = val.indexOf(' - ');
        if (index < 0) {
            return val;
        }
        const from = val.substring(0, index);
        const to = val.substring(index + 3);
        return {
            from: from,
            to: to
        };
    }

    private selectAccessor() {
        let accessors = this.injector.get<ControlValueAccessor | ControlValueAccessor[]>(NG_VALUE_ACCESSOR);
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
            const val = this.parseValue(v);
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
        super.setDisabledState(isDisabled);
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
        super.ngOnDestroy();
    }

    abstract resolveFactory(): ComponentFactory<BaseDatePickerPopupComponent>;

    createComponent(): void {
        let factory = this.resolveFactory();
        this.componentRef = this.viewContainerRef.createComponent(factory);
        this.componentRef.instance.hostedElement = this.el;
        
        this.addBoundChild(this.componentRef.instance);
    }

    
    @HostListener('focus') onForus() {
        this.componentRef.instance.show = true;
    }


    @HostListener('blur') onBlur() {
        this.componentRef.instance.show = false;
    }

    @Input() set orientTop(val: boolean) {
        val = !!val;
        if (this._orientRight != val) {
            this._orientTop = val;
        }
    }
    get orientTop(): boolean {
        return this._orientTop;
    }

    @Input() set orientRight(val: boolean | null) {
        val = val === false || val === null ? val : !!val;
        if (this._orientRight != val) {
            this._orientRight = val;
        }
    }

    get orientRight(): boolean {
        return this._orientRight === null ? !this.cultureService.isRightToLeft(this.effectiveLocale) : this._orientRight;
    }

    @Input() set format(val: string) {
        this._format = val;
        this._formatSubject.next(val);
    }

    get format(): string {
        return this._format;
    }
}

@Directive({
    selector: '[caDatePicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerDirective), multi: true
    }]
})
export class DatePickerDirective extends BaseDatePickerDirective {

    constructor(@Inject(ComponentFactoryResolver) protected readonly resolver: ComponentFactoryResolver,
        @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
        @Inject(ElementRef) el: ElementRef,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_GLOBALIZATION_SERVICE) globalizationService: IGlobalizationService,
        @Inject(Injector) injector: Injector
    ) {
        super(resolver, viewContainerRef, el, converterService, cultureService, globalizationService, injector);
        this.rangeSelection = false;
    }

    resolveFactory(): ComponentFactory<BaseDatePickerPopupComponent> {
        return this.resolver.resolveComponentFactory(DatePickerPopupComponent);
    }
}

@Directive({
    selector: '[caDateRangePicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangePickerDirective), multi: true
    }]
})
export class DateRangePickerDirective extends BaseDatePickerDirective {

    constructor(@Inject(ComponentFactoryResolver) protected readonly resolver: ComponentFactoryResolver,
        @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
        @Inject(ElementRef) el: ElementRef,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_GLOBALIZATION_SERVICE) globalizationService: IGlobalizationService,
        @Inject(Injector) injector: Injector
    ) {
        super(resolver, viewContainerRef, el, converterService, cultureService, globalizationService, injector);
        this.rangeSelection = true;
    }

    resolveFactory(): ComponentFactory<BaseDatePickerPopupComponent> {
        return this.resolver.resolveComponentFactory(DateRangePickerPopupComponent);
    }
}


