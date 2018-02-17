import { Directive, ComponentFactoryResolver, ViewContainerRef, OnInit, Inject, ComponentRef, HostListener, Input, OnDestroy, forwardRef, ElementRef, Optional, Self, Injector, ComponentFactory, AfterViewInit } from '@angular/core';
import { TimePickerPopupComponent } from '../components/time-picker-popup.component';
import { datesEqual, IDateRange } from '../util';
import { CANG_CULTURE_SERVICE, ICultureService, CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '@code-art/angular-globalize';
import { BaseTimeValueAccessor } from '../base-time-value-accessor';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, DefaultValueAccessor, } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/combineLatest';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as isPlainObject from 'is-plain-object';


@Directive({
    selector: '[caTimePicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimePickerDirective), multi: true
    }]
})
export class TimePickerDirective extends BaseTimeValueAccessor implements OnInit, OnDestroy {

    private componentRef: ComponentRef<TimePickerPopupComponent>;
    private _orientRight: boolean | null = null;
    private _orientTop = false;
    private _controlValueAccessor: ControlValueAccessor = null;
    private _valueChangeSubscription: Subscription;
    private _controlValue: any = null;
    private _format: string = 'short';
    private readonly _formatObservable: Observable<string>;
    private readonly _formatSubject: ReplaySubject<string>;

    constructor(@Inject(ComponentFactoryResolver) protected readonly resolver: ComponentFactoryResolver,
        @Inject(ViewContainerRef) private readonly viewContainerRef: ViewContainerRef,
        @Inject(ElementRef) private readonly el: ElementRef,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_GLOBALIZATION_SERVICE) private readonly globalizationService: IGlobalizationService,
        @Inject(Injector) private readonly injector: Injector
    ) {
        super(cultureService, globalizationService);
        this._formatSubject = new ReplaySubject();
        this._formatSubject.next(this._format);
        this._formatObservable = this._formatSubject.asObservable();
    }

    private formatTime(val: number, locale: string, format: string): string {
        if (val === null || val === undefined) {
            return '';
        }
        let d = new Date(2000, 1, 1);
        d.setTime(val + d.valueOf());
        let d2 = new Date();

        d2.setHours(d.getHours());
        d2.setMinutes(d.getMinutes());
        d2.setSeconds(d.getSeconds());
        d2.setMilliseconds(d.getMilliseconds());

        format = format || 'short';
        let options: DateFormatterOptions;
        switch (format) {
            case 'short':
            case 'medium':
            case 'long':
            case 'full':
                options = { time: format }
                break;
            default:
                if (format.indexOf('raw:')) {
                    options = { raw: format.substr(4) };
                } else {
                    options = { skeleton: format };
                }
                break;
        }
        return this.globalizationService.formatDate(d2, locale, options);
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
            if (this.coerceValue(v)) {
                this.value = v;
            }
        });
        this._valueChangeSubscription = Observable.combineLatest(this.cultureService.cultureObservable, this.valueChange.asObservable(), this._formatObservable).subscribe(v => {
            let [locale, val, f] = v;
            locale = this.locale || locale;
            let coercedValue = this.coerceValue(this._controlValue);
            if (!this.compareValues(coercedValue, val)) {
                this._controlValueAccessor.writeValue(this.formatTime(val, locale, f));
            }
        }) as Subscription;
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

    resolveFactory(): ComponentFactory<TimePickerPopupComponent> {
        return this.resolver.resolveComponentFactory(TimePickerPopupComponent);
    }

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
