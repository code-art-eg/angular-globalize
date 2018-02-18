
import { Directive, ComponentFactoryResolver, ViewContainerRef, Inject, ComponentRef, HostListener, Input, forwardRef, ElementRef, Injector, ComponentFactory, ChangeDetectorRef } from '@angular/core';
import { DatePickerComponent, DateRangePickerComponent, BaseDatePickerComponent } from '../components/date-picker.component';
import { CANG_CULTURE_SERVICE, ICultureService, CANG_GLOBALIZATION_SERVICE, IGlobalizationService, CANG_TYPE_CONVERTER_SERVICE, ITypeConverterService } from '@code-art/angular-globalize';
import { BaseDatePickerAccessor } from '../base-date-picker-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IPopupDirective } from '../popups';
import { PopupDirective } from './popup.directive';
import { applyMixins } from '../util';
import * as isPlainObject from 'is-plain-object';


export abstract class BaseDatePickerDirective extends BaseDatePickerAccessor implements IPopupDirective {

    constructor(@Inject(ComponentFactoryResolver) resolver: ComponentFactoryResolver,
        @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
        @Inject(ElementRef) el: ElementRef,
        @Inject(Injector) injector: Injector,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_GLOBALIZATION_SERVICE) private readonly globalizationService: IGlobalizationService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService
    ) {
        super(cultureService, converterService, changeDetector);
        this.initPopupDirective(resolver, viewContainerRef, el, injector);
    }

    getDefaultFormat(): string {
        return 'short';
    }

    initPopupDirective: (resolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, el: ElementRef, injector: Injector) => void;

    abstract resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<BaseDatePickerComponent>;

    @HostListener('focus') onFocus: () => void;


    @HostListener('blur') onBlur: () => void;

    @Input() orientTop: boolean;
    @Input() orientRight: boolean;
    @Input() format: string;

   

    formatValue(val: any, locale: string, format: string): string {
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
}

applyMixins(BaseDatePickerDirective, PopupDirective);

@Directive({
    selector: '[caDatePicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerDirective), multi: true
    }]
})
export class DatePickerDirective extends BaseDatePickerDirective {

    rangeSelection = false;

    resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<BaseDatePickerComponent> {
        return resolver.resolveComponentFactory(DatePickerComponent);
    }
}

@Directive({
    selector: '[caDateRangePicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangePickerDirective), multi: true
    }]
})
export class DateRangePickerDirective extends BaseDatePickerDirective {

    rangeSelection = true;


    resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<BaseDatePickerComponent> {
        return resolver.resolveComponentFactory(DateRangePickerComponent);
    }
}
