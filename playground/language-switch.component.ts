import { Component, Inject } from '@angular/core';

import {    CANG_SUPPORTED_CULTURES, 
            CANG_GLOBALIZATION_SERVICE, 
            CANG_CULTURE_SERVICE, 
            IGlobalizationService, 
            ICultureService } from '@code-art/angular-globalize';

@Component({
    selector: 'language-switch',
    templateUrl: './language-switch.component.html'
})
export class LanguageSwitchComponent{
    constructor( @Inject(CANG_SUPPORTED_CULTURES) readonly supportedCultures: string[],
        @Inject(CANG_CULTURE_SERVICE) readonly cultureService: ICultureService,
        ) {

    }


}