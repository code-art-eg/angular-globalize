import { Input, Inject, Directive, ElementRef, Renderer2, OnDestroy } from "@angular/core";
import { ICultureService, CANG_CULTURE_SERVICE } from "../services/current-culture.service";
import { Subscription } from "rxjs/Subscription";


@Directive({
    selector: '[caDirection]'
})
export class GlobalizeDirectionDirective implements OnDestroy {

   
    private _rtlCssClass: string = null;
    private _ltrCssClass: string = null;
    private _isRtl: boolean;
    private _locale: string = null;
    private readonly sub: Subscription;

    constructor(@Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService,
        @Inject(ElementRef) private readonly el: ElementRef,
        @Inject(Renderer2) private readonly renderer: Renderer2
    ) {
        this.handleLocaleChange();
        this.sub = this.cultureService.cultureObservable.subscribe(() => {
            this.handleLocaleChange();
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    @Input() set rtlCssClass(val: string) {
        val = val || null;
        if (val !== this._rtlCssClass) {
            if (this._isRtl && this._rtlCssClass) {
                this.renderer.removeClass(this.el.nativeElement, this._rtlCssClass);
            }
            this._rtlCssClass = val;
            if (this._isRtl && this._rtlCssClass) {
                this.renderer.addClass(this.el.nativeElement, this._rtlCssClass);
            }
        }
    }

    get rtlCssClass(): string {
        return this._rtlCssClass;
    }

    @Input() set ltrCssClass(val: string) {
        val = val || null;
        if (val !== this.ltrCssClass) {
            if (!this._isRtl && this._ltrCssClass) {
                this.renderer.removeClass(this.el.nativeElement, this._ltrCssClass);
            }
            this._ltrCssClass = val;
            if (!this._isRtl && this._ltrCssClass) {
                this.renderer.addClass(this.el.nativeElement, this._ltrCssClass);
            }
        }
    }

    get ltrCssClass(): string {
        return this._ltrCssClass;
    }


    @Input() set locale(val: string) {
        val = val || null;
        if (this._locale !== val) {
            this._locale = val;
            this.handleLocaleChange();
        }
    }

    get locale(): string {
        return this._locale;
    }

    handleLocaleChange() {
        const isrtl = this.cultureService.isRightToLeft(this._locale);
        if (this._isRtl !== isrtl) { // initially this._isRtl will be undefined so this will always be true
            this._isRtl = isrtl;
            if (this._isRtl) {
                if (this.ltrCssClass) {
                    this.renderer.removeClass(this.el.nativeElement, this.ltrCssClass);
                }
                if (this.rtlCssClass) {
                    this.renderer.addClass(this.el.nativeElement, this.rtlCssClass);
                }
                this.renderer.setAttribute(this.el.nativeElement, "dir", "rtl");
            } else {
                if (this.ltrCssClass) {
                    this.renderer.addClass(this.el.nativeElement, this.ltrCssClass);
                }
                if (this.rtlCssClass) {
                    this.renderer.removeClass(this.el.nativeElement, this.rtlCssClass);
                }
                this.renderer.setAttribute(this.el.nativeElement, "dir", "ltr");
            }
        }
    }
}