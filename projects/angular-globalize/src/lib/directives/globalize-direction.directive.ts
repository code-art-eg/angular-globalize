import { Directive, ElementRef, Renderer2, Input } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CurrentCultureService } from '../services/current-culture/current-culture.service';

@Directive({
  selector: '[glbDirection]'
})
export class GlobalizeDirectionDirective implements OnDestroy {

  private _rtlCssClass: string|undefined;
  private _ltrCssClass: string|undefined;
  private _isRtl: boolean|undefined = undefined;
  private _locale = '';
  private readonly sub: Subscription;

  constructor(private readonly cultureService: CurrentCultureService,
              private readonly el: ElementRef,
              private readonly renderer: Renderer2) {
      this.handleLocaleChange();
      this.sub = this.cultureService.cultureObservable.subscribe(() => {
          this.handleLocaleChange();
      });
  }

  public ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

  @Input() set rtlCssClass(val: string | undefined | null ) {
      val = val || undefined;
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

  get rtlCssClass(): string | undefined | null  {
      return this._rtlCssClass;
  }

  @Input() set ltrCssClass(val: string | undefined | null) {
      val = val || undefined;
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

  get ltrCssClass(): string | undefined | null {
      return this._ltrCssClass;
  }

  @Input() set locale(val: string) {
      val = val || '';
      if (this._locale !== val) {
          this._locale = val;
          this.handleLocaleChange();
      }
  }

  get locale(): string {
      return this._locale;
  }

  public handleLocaleChange(): void {
      const isrtl: boolean = this.cultureService.isRightToLeft(this._locale);
      if (this._isRtl !== isrtl) { // initially this._isRtl will be undefined so this will always be true
          this._isRtl = isrtl;
          if (this._isRtl) {
              if (this.ltrCssClass) {
                  this.renderer.removeClass(this.el.nativeElement, this.ltrCssClass);
              }
              if (this.rtlCssClass) {
                  this.renderer.addClass(this.el.nativeElement, this.rtlCssClass);
              }
              this.renderer.setAttribute(this.el.nativeElement, 'dir', 'rtl');
          } else {
              if (this.ltrCssClass) {
                  this.renderer.addClass(this.el.nativeElement, this.ltrCssClass);
              }
              if (this.rtlCssClass) {
                  this.renderer.removeClass(this.el.nativeElement, this.rtlCssClass);
              }
              this.renderer.setAttribute(this.el.nativeElement, 'dir', 'ltr');
          }
      }
  }
}
