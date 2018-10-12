import { Component, Input } from '@angular/core';

@Component({
    selector: 'cadp-icon-chevron-up',
    styleUrls: ['../../styles/icon-styles.scss'],
    templateUrl: './icon-chevron-up.component.html',
})
export class IconChevronUpComponent {
    @Input() public iconCssClassName = 'icon-chevron-up';
}
