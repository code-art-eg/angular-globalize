import {
    AfterViewInit, ChangeDetectorRef, Component, ElementRef,
    forwardRef, Inject, OnDestroy, ViewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import {
    CANG_CULTURE_SERVICE, CANG_GLOBALIZATION_SERVICE,
    globalizeStatic, ICultureService, IGlobalizationService,
} from "@code-art/angular-globalize";
import { Subscription } from "rxjs/Subscription";
import { BaseTimeValueAccessor } from "../base-time-value-accessor";
import { IComponentFocus } from "../interfaces";
import { formatTimeComponent, KEY_CODE } from "../util";

interface ITimeData {
    twelveHours: boolean;
    am: string;
    pm: string;
}

@Component({
    providers: [{
        multi: true,
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimePickerComponent),
    }],
    selector: "ca-timepicker",
    styleUrls: ["./time-picker.component.less"],
    templateUrl: "./time-picker.component.html",
})
export class TimePickerComponent extends BaseTimeValueAccessor implements AfterViewInit, OnDestroy, IComponentFocus {
    private static _timeZoneData: { [key: string]: ITimeData } = {};

    private static getTimeZoneData(gl: GlobalizeStatic, locale: string): ITimeData {
        let val = TimePickerComponent._timeZoneData[locale];
        if (!val) {
            const c = new gl(locale);
            const timeFormatData = c.cldr.main(["dates/calendars/gregorian/timeFormats"]);
            const twelveHours = timeFormatData.short.indexOf("h") >= 0;
            let pm: string = null;
            let am: string = null;
            if (twelveHours) {
                const dayPeriods = c.cldr.main(["dates/calendars/gregorian/dayPeriods/stand-alone", "abbreviated"]);
                pm = dayPeriods.pm;
                am = dayPeriods.am;
            }
            val = {
                am,
                pm,
                twelveHours,
            };
            TimePickerComponent._timeZoneData[locale] = val;
        }
        return val;
    }

    @ViewChild("hoursInput") public hoursElement: ElementRef;
    @ViewChild("minutesInput") public minutesElement: ElementRef;
    @ViewChild("secondsInput") public secondsElement: ElementRef;
    @ViewChild("amPmInput1") public amPmElement1: ElementRef;
    @ViewChild("amPmInput2") public amPmElement2: ElementRef;
    public focus: boolean = false;

    private _minutes: number;
    private _hours: number;
    private _seconds: number;
    private _minutesText: string;
    private _hoursText: string;
    private _secondsText: string;
    private _amPmText: string;
    private readonly cultureSub: Subscription;
    private readonly valueSub: Subscription;

    constructor(@Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
                @Inject(CANG_GLOBALIZATION_SERVICE) globalizeService: IGlobalizationService,
                @Inject(ChangeDetectorRef) changeDetector: ChangeDetectorRef) {
        super(cultureService, globalizeService, changeDetector);
        this.cultureSub = cultureService.cultureObservable.subscribe(() => {
            this._hoursText = null;
            this._minutesText = null;
            this._secondsText = null;
            this._amPmText = null;
        });
        this.valueSub = this.valueChange.asObservable().subscribe((v) => {
            if (typeof v === "number") {
                const d = new Date(v);
                this._hours = d.getUTCHours();
                this._minutes = d.getUTCMinutes();
                this._seconds = d.getUTCSeconds();
                this._amPmText = this._hoursText = this._minutesText = this._secondsText = null;
            } else {
                this._amPmText = this._hoursText = this._minutesText = this._secondsText = null;
                this._hours = 0;
                this._minutes = 0;
                this._seconds = 0;
            }
        });
    }

    public ngOnDestroy() {
        this.valueSub.unsubscribe();
        this.cultureSub.unsubscribe();
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
        this.selectAllOnFocus(this.hoursElement, () => this.hours--, () => this.hours++);
        this.selectAllOnFocus(this.minutesElement, () => this.decreaseMinutes(), () => this.increaseMinutes());
        this.selectAllOnFocus(this.secondsElement, () => this.decreaseSeconds(), () => this.increaseSeconds());
        this.selectAllOnFocus(this.amPmElement1, () => this.switchAmPm(), () => this.switchAmPm());
        this.selectAllOnFocus(this.amPmElement2, () => this.switchAmPm(), () => this.switchAmPm());
    }

    get isRtl(): boolean {
        return this.cultureService.isRightToLeft(this.effectiveLocale);
    }

    get am(): string {
        return TimePickerComponent.getTimeZoneData(globalizeStatic, this.effectiveLocale).am;
    }

    get pm(): string {
        return TimePickerComponent.getTimeZoneData(globalizeStatic, this.effectiveLocale).pm;
    }

    get amPmMaxLength(): number {
        return Math.max(this.am.length, this.pm.length);
    }

    get twelveHours(): boolean {
        return TimePickerComponent.getTimeZoneData(globalizeStatic, this.effectiveLocale).twelveHours;
    }

    set minutesText(val: string) {
        const v = this.globalizeService.parseNumber(val, this.effectiveLocale, { style: "decimal" });
        if (v !== null) {
            if (v >= 0 && v < 60) {
                if (this._minutes !== v) {
                    this._minutes = v;
                    this.updateValue();
                }
                this._minutes = v;
                this._minutesText = val;
                if (v > 9 && this.secondsElement
                    && this.secondsElement.nativeElement
                    && typeof this.secondsElement.nativeElement.focus === "function") {
                    this.secondsElement.nativeElement.focus();
                }
            }
        }
    }

    get minutesText(): string {
        return this._minutesText ?
            this._minutesText : formatTimeComponent(this.globalizeService, this.minutes, this.effectiveLocale);
    }

    set amPmText(val: string) {
        const pm = val && val.toLowerCase() === this.pm.toLowerCase();
        const am = !pm && val && val.toLowerCase() === this.am.toLowerCase();
        if (am || pm) {
            if (am && this._hours > 12) {
                this._hours -= 12;
                this.updateValue();
            }
            if (pm && this._hours < 12) {
                this._hours += 12;
                this.updateValue();
            }
            this._amPmText = val;
        }
    }

    get amPmText(): string {
        return this._amPmText ? this._amPmText : (this._hours < 12 ? this.am : this.pm);
    }

    set hoursText(val: string) {
        const v = this.globalizeService.parseNumber(val, this.effectiveLocale, { style: "decimal" });
        if (v !== null) {
            const tw = this.twelveHours;
            const h = tw ? 12 : 24;
            if (v >= 0 && v < h) {
                const newHours = tw && this._hours >= 12 ? 12 + v : v;
                if (this._hours !== newHours) {
                    this._hours = newHours;
                    this.updateValue();
                }
                this._hoursText = val;
                if (v > 2 && this.minutesElement
                    && this.minutesElement.nativeElement
                    && typeof this.minutesElement.nativeElement.focus === "function") {
                    this.minutesElement.nativeElement.focus();
                }
            }
        }
    }

    get hoursText(): string {
        return this._hoursText ? this._hoursText :
            formatTimeComponent(this.globalizeService,
                this.twelveHours ?
                    (this.hours === 0 || this.hours === 12 ? 12 : this.hours % 12)
                    : this.hours, this.effectiveLocale);
    }

    set secondsText(val: string) {
        const v = this.globalizeService.parseNumber(val, this.effectiveLocale, { style: "decimal" });
        if (v !== null) {
            if (v >= 0 && v < 60) {
                if (this._seconds !== v) {
                    this._seconds = v;
                    this.updateValue();
                }
                this._secondsText = val;
            }
        }
    }

    get secondsText(): string {
        return this._secondsText ?
            this._secondsText : formatTimeComponent(this.globalizeService, this.seconds, this.effectiveLocale);
    }

    set minutes(val: number) {
        this._minutesText = null;
        if (typeof val === "number") {
            val = Math.round(val);
            if (val < 0 || val >= 60) {
                const dh = Math.floor(val / 60);
                this._minutes = val - dh * 60;
                this.hours += dh;
                return;
            }
        }
        if (val !== this._minutes) {
            this._minutes = val;
            this.updateValue();
        }
    }

    get minutes(): number {
        return typeof this._minutes === "number" ? this._minutes : 0;
    }

    set hours(val: number) {
        this._hoursText = null;
        this._amPmText = null;
        if (typeof val === "number") {
            val = Math.round(val);
            if (val < 0 || val >= 24) {
                const d = Math.floor(val / 24);
                val = val - d * 24;
            }
        } else {
            val = null;

        }
        if (val !== this._hours) {
            this._hours = val;
            this.updateValue();
        }
    }

    get hours(): number {
        return typeof this._hours === "number" ? this._hours : 0;
    }

    set seconds(val: number) {
        this._secondsText = null;
        if (typeof val === "number") {
            val = Math.round(val);
            if (val < 0 || val >= 60) {
                const dm = Math.floor(val / 60);
                this._seconds = val - dm * 60;
                this.minutes += dm;
                return;
            }
        } else {
            val = null;

        }
        if (val !== this._seconds) {
            this._seconds = val;
            this.updateValue();
        }
    }

    get seconds(): number {
        return typeof this._seconds === "number" ? this._seconds : 0;
    }

    public decreaseMinutes(): void {
        this.minutes = Math.ceil(this.minutes / this.minutesIncrement) * this.minutesIncrement - this.minutesIncrement;
    }

    public increaseMinutes(): void {
        this.minutes = Math.floor(this.minutes / this.minutesIncrement) * this.minutesIncrement + this.minutesIncrement;
    }

    public decreaseSeconds(): void {
        this.seconds = Math.ceil(this.seconds / this.secondsIncrement) * this.secondsIncrement - this.secondsIncrement;
    }

    public increaseSeconds(): void {
        this.seconds = Math.floor(this.seconds / this.secondsIncrement) * this.secondsIncrement + this.secondsIncrement;
    }

    public switchAmPm(): void {
        this.hours = this.hours >= 12 ? this.hours - 12 : this.hours + 12;
    }

    private selectAllOnFocus(ref: ElementRef, keyup?: () => void, keydown?: () => void): void {
        if (!ref) {
            return;
        }
        const input = ref.nativeElement as HTMLInputElement;
        if (input && typeof input.addEventListener === "function" && typeof input.select === "function") {
            input.addEventListener("focus", () => {
                const i = ref.nativeElement;
                if (i && typeof i.select === "function") {
                    i.select();
                }
                this.focus = true;
            });
            input.addEventListener("blur", () => {
                this.focus = false;
            });
            if (keyup || keydown) {
                input.addEventListener("keyup", (e): void => {
                    if (e.keyCode === KEY_CODE.UP_ARROW && keyup) {
                        keyup();
                    }
                    if (e.keyCode === KEY_CODE.DOWN_ARROW && keydown) {
                        keydown();
                    }
                });
            }
        }
    }

    private updateValue(): void {
        this.value = (this.seconds + (this.minutes + this.hours * 60) * 60) * 1000;
    }
}
