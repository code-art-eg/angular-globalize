import { Component, Input } from '@angular/core';

@Component({
    selector: 'cadp-icon-chevron-down',
    styleUrls: ['../../styles/icon-styles.scss'],
    templateUrl: './icon-chevron-down.component.html',
})
export class IconChevronDownComponent {
    @Input() public iconCssClassName = 'icon-chevron-down';
}
