import { Injectable } from '@angular/core';
import { ILocaleProvider } from '../../models';

@Injectable({
    providedIn: 'root'
})
export class NavigatorLanguageLocaleProviderService implements ILocaleProvider {
    public readonly canWrite: boolean = false;

    get locale(): string {
        if (typeof navigator !== 'undefined') {
            const languages = navigator.languages;
            if (languages && languages.length > 0 && languages[0]) {
                return languages[0];
            } else if (navigator.language) {
                return navigator.language;
            }
        }
        return '';
    }
}
