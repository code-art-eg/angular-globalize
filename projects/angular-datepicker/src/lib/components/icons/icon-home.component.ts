import { Component, Input } from '@angular/core';

@Component({
    selector: 'cadp-icon-home',
    styleUrls: ['../../styles/icon-styles.scss'],
    templateUrl: './icon-home.component.html',
})
export class IconHomeComponent {
    @Input() public iconCssClassName = 'icon-home';
}
