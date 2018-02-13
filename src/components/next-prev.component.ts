import { Component, Input, EventEmitter, Output } from '@angular/core';
import { isRightToLeft, NextPrevAction } from '../util';

@Component({
    selector: 'next-prev',
    templateUrl: 'next-prev.component.html',
    styleUrls: ['next-prev.component.less']
})
export class NextPreviousComponent {
    static readonly leftArrow: string = 'glyphicon-chevron-left';
    static readonly rightArrow: string = 'glyphicon-chevron-right';

    constructor() {
        this.locale = null;
        this.nextArrow = NextPreviousComponent.rightArrow;
        this.prevArrow = NextPreviousComponent.leftArrow;
        this.clicked = new EventEmitter<NextPrevAction>();
        this.text = null;
    }

    private _locale: string;
    
    @Input()
    homeButton: boolean;
    
    @Input()
    resetButton: boolean;

    @Input()
    set locale(val: string) {
        this._locale = val;
    }

    get locale(): string {
        return this._locale;
    }

    getClass(type: 'next'|'prev'): string {
        if (type === 'next') {
            return isRightToLeft(this.locale) ? NextPreviousComponent.leftArrow : NextPreviousComponent.rightArrow;
        }
        else
            return isRightToLeft(this.locale) ? NextPreviousComponent.rightArrow: NextPreviousComponent.leftArrow;
    }

    nextArrow: string;
    prevArrow: string;
    @Input()
    text: string;

    @Output()
    clicked: EventEmitter<NextPrevAction>;
}