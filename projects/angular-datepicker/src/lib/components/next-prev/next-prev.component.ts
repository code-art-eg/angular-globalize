import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrentCultureService } from '@code-art/angular-globalize';
import { NextPrevAction } from '../../util';

@Component({
    selector: 'cadp-next-prev',
    styleUrls: ['./next-prev.component.scss'],
    templateUrl: './next-prev.component.html',
})
export class NextPreviousComponent {
    @Input() public homeButton: boolean;
    @Input() public resetButton: boolean;
    @Input() public locale: string;
    @Input() public text: string;
    @Output() public readonly clicked: EventEmitter<NextPrevAction>;

    constructor(private readonly cultureService: CurrentCultureService) {
        this.locale = null;
        this.clicked = new EventEmitter<NextPrevAction>();
        this.text = null;
        this.resetButton = true;
        this.homeButton = true;
    }

    get isRtl(): boolean {
        return this.cultureService.isRightToLeft(this.locale);
    }
}
