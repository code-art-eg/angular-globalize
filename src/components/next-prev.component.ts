import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { CANG_CULTURE_SERVICE, ICultureService } from "@code-art/angular-globalize";
import { NextPrevAction } from "../util";

@Component({
    selector: "ca-next-prev",
    styleUrls: ["./styles/next-prev.component.less"],
    templateUrl: "./templates/next-prev.component.html",
})
export class NextPreviousComponent {
    public static readonly leftArrow: string = "glyphicon-chevron-left";
    public static readonly rightArrow: string = "glyphicon-chevron-right";
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

    public getClass(type: "next" | "prev"): string {
        if (type === "next") {
            return this.cultureService.isRightToLeft(this.locale) ?
                NextPreviousComponent.leftArrow : NextPreviousComponent.rightArrow;
        } else {
            return this.cultureService.isRightToLeft(this.locale) ?
                NextPreviousComponent.rightArrow : NextPreviousComponent.leftArrow;
        }
    }
}
