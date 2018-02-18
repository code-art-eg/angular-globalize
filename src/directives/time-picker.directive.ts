
import { Directive, ComponentFactoryResolver, ViewContainerRef, Inject, ComponentRef, HostListener, Input, forwardRef, ElementRef, Injector, ComponentFactory, ChangeDetectorRef } from '@angular/core';
import { TimePickerComponent } from '../components/time-picker.component';
import { CANG_CULTURE_SERVICE, ICultureService, CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from '@code-art/angular-globalize';
import { BaseTimeValueAccessor } from '../base-time-value-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IPopupDirective } from '../popups';
import { PopupDirective } from './popup.directive';
import { applyMixins } from '../util';

@Directive({
    selector: '[caTimePicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimePickerDirective), multi: true
    }]
})
export class TimePickerDirective extends BaseTimeValueAccessor implements IPopupDirective {
    
    constructor(@Inject(ComponentFactoryResolver) resolver: ComponentFactoryResolver,
        @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
        @Inject(ElementRef) el: ElementRef,
        @Inject(Injector) injector: Injector,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_GLOBALIZATION_SERVICE) private readonly globalizationService: IGlobalizationService,
        @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef
    ) {
        super(cultureService, globalizationService, changeDetector);
        this.initPopupDirective(resolver, viewContainerRef, el, injector);
    }

    formatValue(val: number, locale: string, format: string): string {
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

    getDefaultFormat(): string {
        return 'short';
    }

    initPopupDirective: (resolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, el: ElementRef, injector: Injector) => void;

    resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<TimePickerComponent> {
        return resolver.resolveComponentFactory(TimePickerComponent);
    }

    @HostListener('focus') onFocus: () => void;


    @HostListener('blur') onBlur: () => void;

    @Input() orientTop: boolean;
    @Input() orientRight: boolean;
    @Input() format: string;
}

applyMixins(TimePickerDirective, PopupDirective);