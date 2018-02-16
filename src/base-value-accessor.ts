import { OnDestroy, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/observable/combineLatest';

import { ICultureService } from '@code-art/angular-globalize';

export abstract class BaseValueAccessor implements OnDestroy, ControlValueAccessor {

    private readonly _boundChildren: BaseValueAccessor[] = [];
    private readonly _localeSubject = new ReplaySubject<string>();
    private readonly _localeObservable = this._localeSubject.asObservable();
    private _parent: BaseValueAccessor = null;
    private _effectiveLocale: string = null;
    private _disabled = false;
    private _locale: string = undefined;
    private _onchange: (val: any) => void = null;
    private _ontouch: () => void = null;
    private _value: any = null;
    private _valueSet: boolean = false;
    private readonly _localeSubscription = Observable.combineLatest(this._localeObservable, this.cultureService.cultureObservable)
        .subscribe({
            next: vals => {
                const [localeVal, cultureVal] = vals;
                this.effectiveLocale = localeVal || cultureVal;
            }
        });

    constructor(protected readonly cultureService: ICultureService) {
        this.effectiveLocale = this.cultureService.currentCulture;
        this.locale = null;

    }

    protected addBoundChild(child: BaseValueAccessor): void {
        if (child === this) {
            throw `Cannot bind to self`;
        }
        if (child._parent === this || this._boundChildren.indexOf(child) >= 0) {
            return;
        }

        this._boundChildren.push(child);
        child._parent = this;
    }

    protected removeBoundChild(child: BaseValueAccessor): void {
        const index = this._boundChildren.indexOf(child);
        if (index >= 0) {
            this._boundChildren.splice(index, 1);
        }
        if (child._parent === this) {
            child._parent = null;
        }
    }

    get parent(): BaseValueAccessor {
        return this._parent;
    }

    get effectiveLocale(): string {
        if (this.parent) {
            return this.parent.effectiveLocale;
        }
        return this._effectiveLocale;
    }

    set effectiveLocale(val: string) {
        if (this.parent) {
            this.parent.effectiveLocale = val;
            return;
        }
        this._effectiveLocale = val;
    }

    @Input() set disabled(val: boolean) {
        if (this.parent) {
            this.parent.disabled = val;
            return;
        }
        this._disabled = !!val;
    }

    get disabled(): boolean {
        if (this.parent) {
            return this.parent.disabled;
        }
        return this._disabled;
    }

    @Input() set locale(val: string) {
        if (this.parent) {
            this.parent.locale = val;
            return;
        }
        if (this._locale !== val) {
            this._locale = val;
            this._localeSubject.next(val);
        }
    }

    get locale(): string {
        if (this.parent) {
            return this.parent.locale;
        }
        return this._locale;
    }

    writeValue(val: any): void {
        this.value = val;
    }

    get value(): any {
        if (this.parent) {
            return this.parent.value;
        }
        return this._value;
    }

    @Input() set value(val: any) {
        if (this.parent) {
            this.parent.value = val;
            return;
        }
        val = this.coerceValue(val);
        if (this.compareValuesInternal(this._value, val)) {
            return;
        }
        this._value = val;
        this.raiseOnChange(val);
    }

    @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

    protected onIsRtlChanged(): void {

    }

    ngOnDestroy() {
        this._localeSubscription.unsubscribe();
    }


    registerOnChange(fn: any): void {
        if (typeof fn === 'function') {
            this._onchange = fn;
        }
    }

    private raiseOnChange(val: any): void {
        if (typeof this._onchange === 'function') {
            this._onchange(val);
        }
        this.valueChange.emit(val)
    }

    registerOnTouched(fn: any): void {
        if (typeof fn === 'function') {
            this._ontouch = fn;
        }
    }

    protected raiseOnTouch(): void {
        if (typeof this._ontouch === 'function') {
            this._ontouch();
        }
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = !!isDisabled;
    }

    protected coerceValue(val: any): any {
        return val;
    }

    protected compareValues(v1: any, v2: any): boolean {
        return v1 === v2;
    }

    private compareValuesInternal(v1: any, v2: any): boolean {
        if (v1 === v2) {
            return true;
        }
        if (v1 === null || v1 === undefined) return false;
        if (v2 === null || v2 === undefined) return false;
        if (typeof v1 !== typeof v2) return false;
        return this.compareValues(v1, v2);
    }
}