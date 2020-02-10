import { Component, Inject } from '@angular/core';
import { CANG_SUPPORTED_CULTURES, CurrentCultureService } from '@code-art/angular-globalize';

@Component({
  selector: 'app-language-switch',
  templateUrl: './language-switch.component.html',
  styleUrls: ['./language-switch.component.scss']
})
export class LanguageSwitchComponent {

  constructor(
    @Inject(CANG_SUPPORTED_CULTURES) readonly supportedCultures: string[],
    readonly cultureService: CurrentCultureService,
  ) {

  }
}
