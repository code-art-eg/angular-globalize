import { ChangeDetectorRef, Component, forwardRef, Inject, OnDestroy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
    CANG_CULTURE_SERVICE, CANG_TYPE_CONVERTER_SERVICE, ICultureService,
    ITypeConverterService,
} from "@code-art/angular-globalize";
import { BaseDatePickerComponent } from "./base-date-picker.component";

@Component({
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent),
    }],
    selector: "ca-datepicker",
    styleUrls: ["./styles/date-picker.component.less"],
    templateUrl: "./templates/date-picker.component.html",
})
export class DatePickerComponent extends BaseDatePickerComponent implements OnDestroy {
    public rangeSelection = false;

    constructor(@Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
                @Inject(CANG_TYPE_CONVERTER_SERVICE) converterService: ITypeConverterService,
                @Inject(ChangeDetectorRef) changeDetector?: ChangeDetectorRef) {
        super(cultureService, converterService, changeDetector);
    }
}
