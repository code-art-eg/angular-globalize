import { ComponentFactory, ComponentFactoryResolver, Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDatePickerComponent } from '../components/base-date-picker-component';
import { DatePickerComponent } from '../components/date-picker/date-picker.component';
import { BaseDatePickerDirective } from './base-date-picker-directive';

@Directive({
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerDirective),
    }],
    selector: '[cadpDatePicker]',
})
export class DatePickerDirective extends BaseDatePickerDirective {
    public rangeSelection = false;

    public resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<BaseDatePickerComponent> {
        return resolver.resolveComponentFactory(DatePickerComponent);
    }
}
