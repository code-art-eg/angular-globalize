import { Component, Input } from '@angular/core';

@Component({
    selector: 'cadp-icon-clock',
    styleUrls: ['../../styles/icon-styles.scss'],
    templateUrl: './icon-clock.component.html',
})
export class IconClockComponent {
    @Input() public iconCssClassName = 'icon-clock';
}
