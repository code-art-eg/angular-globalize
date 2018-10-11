import { Injectable, Optional, Inject } from '@angular/core';

import { CANG_LOCALE_STORAGE_KEY, CANG_USE_SESSION_STORAGE, CANG_DEFAULT_LOCALE_KEY } from '../../constants';
import { ILocaleProvider } from '../../models';

@Injectable()
export class StorageLocaleProviderService implements ILocaleProvider {
    public readonly canWrite: boolean = true;
    private readonly _storage: Storage;
    private readonly _key: string;

    constructor(@Inject(CANG_LOCALE_STORAGE_KEY) key?: string,
                @Optional() @Inject(CANG_USE_SESSION_STORAGE) private readonly useSessionStorage?: boolean) {
        this._key = key || CANG_DEFAULT_LOCALE_KEY;
        this.useSessionStorage = this.useSessionStorage || false;
        this._storage = this.useSessionStorage ? sessionStorage : localStorage;
    }

    get locale(): string {
        if (this._storage) {
            return this._storage.getItem(this._key) || '';
        }
        return '';
    }

    set locale(val: string) {
        if (this._storage) {
            if (val) {
                this._storage.setItem(this._key, val);
            } else {
                if (this._storage.getItem(this._key)) {
                    this._storage.removeItem(this._key);
                }
            }
        }
    }
}
