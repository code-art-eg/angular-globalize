import { Component, Inject } from '@angular/core';
import { CANG_SUPPORTED_CULTURES, CurrentCultureService } from '@code-art/angular-globalize';

@Component({
  selector: 'app-culture-switch',
  templateUrl: './culture-switch.component.html',
  styleUrls: ['./culture-switch.component.scss']
})
export class CultureSwitchComponent {

  constructor(
    @Inject(CANG_SUPPORTED_CULTURES) readonly supportedCultures: string[],
    readonly cultureService: CurrentCultureService,
  ) {

  }
}
