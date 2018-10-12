import { Component, Input } from '@angular/core';

@Component({
    selector: 'cadp-icon-calendar-alt',
    styleUrls: ['../../styles/icon-styles.scss'],
    templateUrl: './icon-calendar-alt.component.html',
})
export class IconCalendarAltComponent {
    @Input() public iconCssClassName = 'icon-calendar-alt';
}
