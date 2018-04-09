import {
    ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, Directive, ElementRef,
    forwardRef, HostListener, Inject, Injector, Input, OnDestroy, OnInit, ViewContainerRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
    CANG_CULTURE_SERVICE, CANG_GLOBALIZATION_SERVICE,
    CANG_TYPE_CONVERTER_SERVICE, ICultureService,
    IGlobalizationService, ITypeConverterService,
} from "@code-art/angular-globalize";
import { BaseDatePickerAccessor } from "../base-date-picker-accessor";
import { DateTimePickerComponent } from "../components/datetime-picker.component";
import { IBaseValueAccessor, IDateTimePicker, IPopupDirective } from "../interfaces";
import { TimePickerOptions } from "../time-picker-options";
import { applyMixins } from "../util";
import { PopupDirective } from "./popup.directive";

@Directive({
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimePickerDirective),
    }],
    selector: "[caDateTimePicker]",
})
export class DateTimePickerDirective extends BaseDatePickerAccessor<IDateTimePicker>
    implements IPopupDirective<IDateTimePicker>, IDateTimePicker, OnInit, OnDestroy {

    @HostListener("focus") public onFocus: () => void;
    @HostListener("blur") public onBlur: () => void;
    @Input() public orientTop: boolean;
    @Input() public orientRight: boolean;
    @Input() public format: string;
    @Input() public minutesIncrement: number;
    @Input() public secondsIncrement: number;
    @Input() public showSeconds: boolean;
    public parent: IBaseValueAccessor<IDateTimePicker> & IDateTimePicker;
    public initPopupDirective: (resolver: ComponentFactoryResolver,
                                viewContainerRef: ViewContainerRef,
                                el: ElementRef,
                                injector: Injector) => void;

    constructor(@Inject(ComponentFactoryResolver) resolver: ComponentFactoryResolver,
                @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
                @Inject(ElementRef) el: ElementRef,
                @Inject(Injector) injector: Injector,
                @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
                @Inject(CANG_GLOBALIZATION_SERVICE) private readonly globalizationService: IGlobalizationService,
                @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef,
                @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService) {
        super(cultureService, converterService, changeDetector);
        this.initPopupDirective(resolver, viewContainerRef, el, injector);
    }

    public getDefaultFormat(): string {
        return "short";
    }

    public resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<DateTimePickerComponent> {
        return resolver.resolveComponentFactory(DateTimePickerComponent);
    }

    public formatValue(val: any, locale: string, format: string): string {
        if (val === undefined || val === null) {
            return "";
        }
        if (val instanceof Date) {
            return this.formatDate(val, locale, format);
        }
        return "";
    }

    public ngOnInit(): void {
        // Do nothing
    }

    public ngOnDestroy(): void {
        // Do nothing
    }

    private formatDate(val: Date, locale: string, format: string) {
        format = format || "short";
        let options: DateFormatterOptions;
        switch (format) {
            case "short":
            case "medium":
            case "long":
            case "full":
                options = { datetime: format };
                break;
            default:
                if (format.indexOf("raw:")) {
                    options = { raw: format.substr(4) };
                } else {
                    options = { skeleton: format };
                }
                break;
        }
        return this.globalizationService.formatDate(val, locale, options);
    }
}

applyMixins(DateTimePickerDirective, PopupDirective, TimePickerOptions);
