import { Component, Inject } from "@angular/core";

import {
    CANG_SUPPORTED_CULTURES,
    CurrentCultureService,
} from "@code-art/angular-globalize";

@Component({
    selector: "language-switch",
    templateUrl: "./language-switch.component.html",
})
export class LanguageSwitchComponent {
    constructor(@Inject(CANG_SUPPORTED_CULTURES) readonly supportedCultures: string[],
                readonly cultureService: CurrentCultureService) {

    }
}
