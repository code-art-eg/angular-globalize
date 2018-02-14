import { Directive, ComponentFactoryResolver, ViewContainerRef, Renderer2, ElementRef, OnInit, Inject } from '@angular/core';
import { DatePickerPopupComponent } from '../components/date-picker-popup.component';


@Directive({
    selector: '[caDatePicker]'
})
export class DatePickerDirective implements OnInit {
    
    
    constructor(@Inject(ComponentFactoryResolver) private readonly resolver: ComponentFactoryResolver,
        @Inject(ViewContainerRef) private readonly viewContainerRef: ViewContainerRef,
        @Inject(ElementRef) private readonly elementRef: ElementRef,
        @Inject(Renderer2) private readonly renderer: Renderer2
        ) {

    }
    
    ngOnInit(): void {
        this.createComponent();
    }

    createComponent(): void {
        let factory = this.resolver.resolveComponentFactory(DatePickerPopupComponent);
        let ref = this.viewContainerRef.createComponent(factory);
    }
}