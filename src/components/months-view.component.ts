import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output } from "@angular/core";
import {
    CANG_CULTURE_SERVICE,
    CANG_GLOBALIZATION_SERVICE, ICultureService, IGlobalizationService } from "@code-art/angular-globalize";
import { createDate, formatYear, IMonthYearSelection, KEY_CODE, NextPrevAction, twelveArray } from "../util";

@Component({
    selector: "ca-months-view",
    styleUrls: ["./styles/year-month-view.less"],
    templateUrl: "./templates/months-view.component.html",
})
export class MonthsViewComponent implements OnInit {
    @Input() public homeButton: boolean;
    @Input() public resetButton: boolean;
    @Input() public maxDate: Date;
    @Input() public minDate: Date;
    @Input() public month: number;
    @Input() public handleKeyboardEvents: boolean;
    @Output() public command: EventEmitter<IMonthYearSelection>;
    public focusMonth: number;
    public nextPrevText: string;
    public readonly months = twelveArray;
    private _year: number;
    private _locale: string;

    constructor(@Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService,
                @Inject(CANG_GLOBALIZATION_SERVICE) private readonly globalizationService: IGlobalizationService) {
        this._year = undefined;
        this._locale = undefined;
        this.month = undefined;
        this.nextPrevText = undefined;
        this.command = new EventEmitter<IMonthYearSelection>();
        this.focusMonth = null;
        this.handleKeyboardEvents = false;
    }

    public ngOnInit(): void {
        this.focusMonth = null;
    }

    @HostListener("window:keyup", ["$event"])
    public keyEvent(event: KeyboardEvent) {
        if (!this.handleKeyboardEvents) {
            return;
        }
        if (event.keyCode === KEY_CODE.LEFT_ARROW) {
            this.addFocusMonth(this.cultureService.isRightToLeft(this.locale) ? 1 : -1);
        } else if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
            this.addFocusMonth(this.cultureService.isRightToLeft(this.locale) ? -1 : 1);
        } else if (event.keyCode === KEY_CODE.UP_ARROW) {
            this.addFocusMonth(-3);
        } else if (event.keyCode === KEY_CODE.DOWN_ARROW) {
            this.addFocusMonth(3);
        } else if (event.keyCode === KEY_CODE.ENTER) {
            this.monthClick(typeof(this.focusMonth) === "number" ? this.focusMonth : this.month);
            this.focusMonth = null;
        }
    }

    @Input()
    set year(val: number) {
        this.nextPrevText = formatYear(this.globalizationService, val, this.locale);
        this._year = val;
    }

    get year(): number {
        return this._year;
    }

    @Input()
    set locale(val: string) {
        this._locale = val;
        this.nextPrevText = formatYear(this.globalizationService, this.year, val);
    }

    get locale(): string {
        return this._locale;
    }

    public onNextPrevClicked(evt: NextPrevAction): void {
        if (evt === "next") {
            this.command.emit({
                year: this.year + 1,
            });
        } else if (evt === "prev") {
            this.command.emit({
                year: this.year - 1,
            });
        } else if (evt === "text") {
            this.command.emit({
                view: "years",
            });
        } else if (evt === "home") {
            this.command.emit({
                view: "home",
            });
        } else if (evt === "reset") {
            this.command.emit({
                reset: true,
            });
        }
    }

    public monthClick(month: number): void {
        if (this.isDisabled(month)) {
            return;
        }
        this.command.emit({
            month,
            view: "days",
        });
    }

    public isDisabled(month: number): boolean {
        if (this.maxDate) {
            const start = createDate(this.year, month, 1);
            if (start.valueOf() > this.maxDate.valueOf()) {
                return true;
            }
        }
        if (this.minDate) {
            const end = createDate(this.year, month,
                this.globalizationService.getCalendar(this.locale).getDaysInMonth(this.year, month));
            if (end.valueOf() < this.minDate.valueOf()) {
                return true;
            }
        }
        return false;
    }

    private addFocusMonth(val: number): void {
        if (typeof this.focusMonth === "number") {
            this.focusMonth = this.focusMonth + val;
            if (this.focusMonth < 0 || this.focusMonth > 11) {
                let newYear = this.year;
                while (this.focusMonth < 0) {
                    this.focusMonth += 12;
                    newYear--;
                }
                while (this.focusMonth > 11) {
                    this.focusMonth -= 12;
                    newYear++;
                }
                this.command.emit({
                    year: newYear,
                });
            }
        } else {
            this.focusMonth = this.month;
        }
    }
}
