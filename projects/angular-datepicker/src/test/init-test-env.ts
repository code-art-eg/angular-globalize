import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
    CANG_SUPPORTED_CULTURES, CANG_LOCALE_PROVIDER,
    StorageLocaleProviderService, CANG_DEFAULT_LOCALE_KEY,
    CANG_LOCALE_STORAGE_KEY, AngularGlobalizeModule
} from '@code-art/angular-globalize';

import { loadGlobalizeData } from './globalize-data-loader';
import { ICON_COMPONENTS } from '../lib/components/icons';

export async function initComponentTest(...args: Type<any>[]): Promise<any> {
    const cultures = ['en-GB', 'ar-EG', 'de'];
    localStorage.clear();
    loadGlobalizeData();
    return TestBed.configureTestingModule({
        imports: [AngularGlobalizeModule],
        providers: [
            {
                provide: CANG_SUPPORTED_CULTURES, useValue: cultures,
            },
            {
                provide: CANG_LOCALE_PROVIDER, useClass: StorageLocaleProviderService, multi: true,
            },
            { provide: CANG_LOCALE_STORAGE_KEY, useValue: CANG_DEFAULT_LOCALE_KEY },
        ],
        declarations: [...args.concat(ICON_COMPONENTS)],
    }).compileComponents();
}
