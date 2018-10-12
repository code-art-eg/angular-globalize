import { Component, Input } from '@angular/core';

@Component({
    selector: 'cadp-icon-chevron-right',
    styleUrls: ['../../styles/icon-styles.scss'],
    templateUrl: './icon-chevron-right.component.html',
})
export class IconChevronRightComponent {
    @Input() public iconCssClassName = 'icon-chevron-right';
}
