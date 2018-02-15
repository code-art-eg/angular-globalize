import { Directive, ComponentFactoryResolver, ViewContainerRef, OnInit, Inject, ComponentRef, HostListener, Input, OnDestroy, forwardRef, ElementRef } from '@angular/core';
import { DatePickerPopupComponent } from '../components/date-picker-popup.component';
import { datesEqual, IDateRange } from '../util';
import { CANG_TYPE_CONVERTER_SERVICE, ITypeConverterService, CANG_CULTURE_SERVICE, ICultureService } from '@code-art/angular-globalize';
import { BaseDatePickerAccessor } from '../base-date-picker-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[caDatePicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerDirective), multi: true
    }]
})
export class DatePickerDirective extends BaseDatePickerAccessor implements OnInit, OnDestroy {


    private componentRef: ComponentRef<DatePickerPopupComponent>;
    private _orientRight: boolean | null = null;
    private _orientTop = false;


    constructor(@Inject(ComponentFactoryResolver) private readonly resolver: ComponentFactoryResolver,
        @Inject(ViewContainerRef) private readonly viewContainerRef: ViewContainerRef,
        @Inject(ElementRef) private readonly el: ElementRef,
        @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService,
        @Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService
    ) {
        super(cultureService, converterService);
        this.handleKeyboardEvents = true;
    }


    ngOnInit(): void {
        this.createComponent();
    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
        super.ngOnDestroy();
    }

    createComponent(): void {
        let factory = this.resolver.resolveComponentFactory(DatePickerPopupComponent);
        this.componentRef = this.viewContainerRef.createComponent(factory);
        const renderer = this.componentRef.instance.renderer;
        const host = renderer.selectRootElement('#control-host');

        let element = this.el.nativeElement;
        while (element.newNativeElement) {
            element = element.newNativeElement;
        }
        element.newNativeElement = host;

        renderer.appendChild(host, this.el.nativeElement);
        this.addBoundChild(this.componentRef.instance);
    }

    @Input() autoClose = false;

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
        return this._orientRight === null ? !this.isRtl : this._orientRight;
    }
}