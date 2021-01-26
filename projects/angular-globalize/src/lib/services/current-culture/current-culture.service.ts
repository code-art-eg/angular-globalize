import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER } from '../../constants';
import { ILocaleProvider } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class CurrentCultureService {

  private static readonly rtlLangs = ['ar', 'dv', 'fa', 'he',
    'ku', 'nqo', 'pa', 'prs', 'ps', 'sd', 'syr', 'tzm', 'ug', 'ur', 'yi'];

  public readonly cultureObservable: Observable<string>;

  private readonly _cultureSubject: ReplaySubject<string>;
  private _culture!: string;
  private readonly _supportedCultures: string[];

  constructor(
    @Inject(CANG_SUPPORTED_CULTURES) supportedCultures: string[],
    @Optional() @Inject(CANG_LOCALE_PROVIDER) private readonly localeProviders?: ILocaleProvider[],
  ) {
    if (supportedCultures === null || supportedCultures === undefined) {
      throw new Error('Parameter supportedCultures passed to CurrentCultureService constructor cannot be null.');
    }
    if (supportedCultures.length === 0) {
      throw new Error('Parameter supportedCultures passed to CurrentCultureService constructor cannot be empty.');
    }
    this._supportedCultures = supportedCultures
      .map((v) => CurrentCultureService.normalizeName(v))
      .filter((v, i, self) => self.indexOf(v) === i);
    const index = this._supportedCultures.findIndex((v) => v === '');
    if (index >= 0) {
      throw new Error('Parameter supportedCultures passed to '
        + 'CurrentCultureService constructor cannot contain empty values. '
        + `Empty value found at index:${index}.`);
    }
    if (this.localeProviders) {
      for (let i = 0; i < this.localeProviders.length; i++) {
        if (!this.localeProviders[i]) {
          throw new Error('Parameter localeProviders is invalid. '
            + `Null or undefined value found at index:${i}.`);
        }
      }
    }
    this._cultureSubject = new ReplaySubject<string>(1);
    this.cultureObservable = this._cultureSubject.asObservable();
    this.currentCulture = '';
  }

  get currentCulture(): string {
    if (this._culture) {
      return this._culture;
    }
    return this.getSupportedCulture(this.getProviderCulture());
  }

  set currentCulture(val: string) {
    if (!val) {
      val = this.getSupportedCulture(this.getProviderCulture());
    } else {
      val = this.getSupportedCulture(val);
    }
    if (val !== this._culture) {
      this._culture = val;
      this._cultureSubject.next(val);
      this.setProviderCulture(val);
    }
  }


  private static normalizeName(c: string | null | undefined): string {
    if (!c) {
      return '';
    }
    c = c.trim().replace('_', '-');
    const split = c.split('-');
    if (split.length === 1) {
      return c.toLocaleLowerCase();
    } else {
      let res = '';
      for (let i = 0; i < split.length; i++) {
        if (i > 0) {
          res += '-';
        }
        if (i === 0) {
          res += split[i].toLowerCase();
        } else if (i === 1 && split[i].length > 2) {
          res += split[1][0].toUpperCase() + split[1].substring(1).toUpperCase();
        } else {
          res += split[i].toUpperCase();
        }
      }
      return res;
    }
  }

  private static sameParent(c1: string, c2: string): boolean {
    if (c1 === c2) {
      return true;
    }

    if (c1 === '' || c2 === '') {
      return false;
    }
    const hyphen1Index = c1.indexOf('-');
    const hyphen2Index = c2.indexOf('-');
    return hyphen1Index > 0 &&
      hyphen2Index > 0 &&
      c1.substr(0, hyphen1Index) === c2.substr(0, hyphen2Index);
  }

  private static isParent(c1: string, c2: string): boolean {
    if (c1 === c2) {
      return true;
    }

    if (c1 === '' || c2 === '') {
      return false;
    }
    const hyphenIndex = c2.indexOf('-');
    if (hyphenIndex >= 0) {
      return c1 === c2.substr(0, hyphenIndex);
    }
    return false;
  }

  public isRightToLeft(locale?: string): boolean {
    locale = (locale || this.currentCulture).toLowerCase();
    if (!locale) {
      return false;
    }
    let index = locale.indexOf('-');
    if (index < 0) {
      index = locale.indexOf('_');
    }
    if (index > 0) {
      locale = locale.substr(0, index);
    }
    return CurrentCultureService.rtlLangs.indexOf(locale) >= 0;
  }

  private getSupportedCulture(c: string): string {
    let index = this._supportedCultures.findIndex((v) => v === c);
    if (index < 0) {
      index = this._supportedCultures.findIndex((v) => CurrentCultureService.isParent(v, c));
    }
    if (index < 0) {
      index = this._supportedCultures.findIndex((v) => CurrentCultureService.isParent(c, v));
    }
    if (index < 0) {
      index = this._supportedCultures.findIndex((v) => CurrentCultureService.sameParent(c, v));
    }
    if (index < 0) {
      index = 0;
    }
    return this._supportedCultures[index];
  }

  private getProviderCulture(): string {
    if (!this.localeProviders) {
      return '';
    }
    for (let i = this.localeProviders.length - 1; i >= 0; i--) {
      const val = this.localeProviders[i].locale;
      if (val) {
        return CurrentCultureService.normalizeName(val);
      }
    }
    return '';
  }

  private setProviderCulture(val: string): void {
    if (!this.localeProviders) {
      return;
    }
    for (let i = this.localeProviders.length - 1; i >= 0; i--) {
      if (this.localeProviders[i].canWrite) {
        this.localeProviders[i].locale = val;
      }
    }
  }
}
