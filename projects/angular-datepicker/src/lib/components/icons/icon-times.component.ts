import { Component, Input } from '@angular/core';

@Component({
    selector: 'cadp-icon-times',
    styleUrls: ['../../styles/icon-styles.scss'],
    templateUrl: './icon-times.component.html',
})
export class IconTimesComponent {
    @Input() public iconCssClassName = 'icon-times';
}
