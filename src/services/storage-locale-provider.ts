import { Inject, Injectable } from "@angular/core";
import {
    CANG_DEFAULT_LOCALE_KEY, CANG_LOCALE_STORAGE_KEY, CANG_USE_SESSION_STORAGE,
    ILocaleProvider,
} from "./current-culture.service";

@Injectable()
export class StorageLocaleProvider implements ILocaleProvider {
    public readonly canWrite: boolean = true;
    private readonly _storage: Storage;

    constructor(@Inject(CANG_LOCALE_STORAGE_KEY) private readonly key?: string,
                @Inject(CANG_USE_SESSION_STORAGE) private readonly useSessionStorage?: boolean) {
        this.key = this.key || CANG_DEFAULT_LOCALE_KEY;
        this.useSessionStorage = this.useSessionStorage || false;
        this._storage = this.useSessionStorage ? sessionStorage : localStorage;
    }

    get locale(): string {
        if (this._storage) {
            return this._storage.getItem(this.key);
        }
        return null;
    }

    set locale(val: string) {
        if (this._storage) {
            if (val) {
                this._storage.setItem(this.key, val);
            } else {
                if (this._storage.getItem(this.key)) {
                    this._storage.removeItem(this.key);
                }
            }
        }
    }
}
