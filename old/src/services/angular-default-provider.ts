import {Inject, Injectable, LOCALE_ID} from "@angular/core";
import { ILocaleProvider } from "./services-common";

@Injectable()
export class AngularDefaultLocaleProvider implements ILocaleProvider {
    public readonly canWrite: boolean = false;

    constructor(@Inject(LOCALE_ID) private readonly localeId: string) {

    }

    get locale(): string {
        return this.localeId;
    }
}
