
import { Directive, ComponentFactoryResolver, ViewContainerRef, Inject, ComponentRef, HostListener, Input, forwardRef, ElementRef, Injector, ComponentFactory, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { DateTimePickerComponent} from '../components/datetime-picker.component';
import { CANG_CULTURE_SERVICE, ICultureService, CANG_GLOBALIZATION_SERVICE, IGlobalizationService, CANG_TYPE_CONVERTER_SERVICE, ITypeConverterService } from '@code-art/angular-globalize';
import { BaseDatePickerAccessor } from '../base-date-picker-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IPopupDirective, IDateTimePicker, IBaseValueAccessor } from '../interfaces';
import { PopupDirective } from './popup.directive';
import { applyMixins } from '../util';
import { TimePickerOptions } from '../base-time-value-accessor';

@Directive({
    selector: '[caDateTimePicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimePickerDirective), multi: true
    }]
})
export class DateTimePickerDirective extends BaseDatePickerAccessor<IDateTimePicker> implements IPopupDirective<IDateTimePicker>, IDateTimePicker, OnInit, OnDestroy {

    @Input() minutesIncrement: number;
    @Input() secondsIncrement: number;
    @Input() showSeconds: boolean;
    parent: IBaseValueAccessor<IDateTimePicker> & IDateTimePicker;
    
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

    resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<DateTimePickerComponent> {
        return resolver.resolveComponentFactory(DateTimePickerComponent);
    }

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
                options = { datetime: format }
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

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }
}

applyMixins(DateTimePickerDirective, PopupDirective, TimePickerOptions);
