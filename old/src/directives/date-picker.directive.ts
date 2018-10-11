import {
    ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, Directive, ElementRef, forwardRef, Inject,
    Injector, ViewContainerRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
    CANG_CULTURE_SERVICE, CANG_GLOBALIZATION_SERVICE, CANG_TYPE_CONVERTER_SERVICE, ICultureService,
    IGlobalizationService, ITypeConverterService,
} from "@code-art/angular-globalize";
import { BaseDatePickerComponent } from "../components/base-date-picker.component";
import { DatePickerComponent } from "../components/date-picker.component";
import { BaseDatePickerDirective } from "./base-date-picker.directive";

@Directive({
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerDirective),
    }],
    selector: "[caDatePicker]",
})
export class DatePickerDirective extends BaseDatePickerDirective {
    public rangeSelection = false;

    constructor(@Inject(ComponentFactoryResolver) resolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ElementRef) el: ElementRef,
                @Inject(Injector) injector: Injector,
                @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
                @Inject(CANG_GLOBALIZATION_SERVICE) globalizationService: IGlobalizationService,
                @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef,
                @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService) {
        super(resolver, viewContainerRef, el, injector, cultureService,
            globalizationService, changeDetector, converterService);
    }

    public resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<BaseDatePickerComponent> {
        return resolver.resolveComponentFactory(DatePickerComponent);
    }
}
