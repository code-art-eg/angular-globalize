import { Component, Input } from '@angular/core';

@Component({
    selector: 'cadp-icon-chevron-left',
    styleUrls: ['../../styles/icon-styles.scss'],
    templateUrl: './icon-chevron-left.component.html',
})
export class IconChevronLeftComponent {
    @Input() public iconCssClassName = 'icon-chevron-left';
}
