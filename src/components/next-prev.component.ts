import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { CANG_CULTURE_SERVICE, ICultureService } from "@code-art/angular-globalize";
import { NextPrevAction } from "../util";

@Component({
    selector: "ca-next-prev",
    styleUrls: ["./next-prev.component.less"],
    templateUrl: "./next-prev.component.html",
})
export class NextPreviousComponent {
    @Input() public homeButton: boolean;
    @Input() public resetButton: boolean;
    @Input() public locale: string;
    @Input() public text: string;
    @Output() public readonly clicked: EventEmitter<NextPrevAction>;

    constructor(@Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService) {
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
