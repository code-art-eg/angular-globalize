import { Component, Input, EventEmitter, Output, Inject } from '@angular/core';
import { NextPrevAction } from '../util';
import { CANG_CULTURE_SERVICE, ICultureService } from '@code-art/angular-globalize';

@Component({
    selector: 'ca-next-prev',
    templateUrl: './templates/next-prev.component.html',
    styleUrls: ['./styles/next-prev.component.less']
})
export class NextPreviousComponent {
    static readonly leftArrow: string = 'glyphicon-chevron-left';
    static readonly rightArrow: string = 'glyphicon-chevron-right';

    constructor(@Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService) {
        this.locale = null;
        this.clicked = new EventEmitter<NextPrevAction>();
        this.text = null;
        this.resetButton = true;
        this.homeButton = true;
    }

    private _locale: string;
    
    @Input()
    homeButton: boolean;
    
    @Input()
    resetButton: boolean;

    @Input()
    locale: string;

    getClass(type: 'next'|'prev'): string {
        if (type === 'next') {
            return this.cultureService.isRightToLeft(this.locale) ? NextPreviousComponent.leftArrow : NextPreviousComponent.rightArrow;
        }
        else
            return this.cultureService.isRightToLeft(this.locale) ? NextPreviousComponent.rightArrow: NextPreviousComponent.leftArrow;
    }

    @Input()
    text: string;

    @Output()
    clicked: EventEmitter<NextPrevAction>;
}