import { ComponentFactory, ComponentFactoryResolver, Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDatePickerComponent } from '../components/base-date-picker-component';
import { DateRangePickerComponent } from '../components/date-picker/date-range-picker.component';
import { BaseDatePickerDirective } from './base-date-picker-directive';

@Directive({
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangePickerDirective),
    }],
    selector: '[cadpDateRangePicker]',
})
export class DateRangePickerDirective extends BaseDatePickerDirective {
    public rangeSelection = true;

    public resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<BaseDatePickerComponent> {
        return resolver.resolveComponentFactory(DateRangePickerComponent);
    }
}
