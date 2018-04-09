import { BaseGlobalizePipe } from "./base-globalize-pipe";

export abstract class BaseDatePipe extends BaseGlobalizePipe<Date, DateFormatterOptions> {

    protected inputsEqual(v1: Date, v2: Date): boolean {
        if (!v1) {
            return !v2;
        }
        if (!v2) {
            return false;
        }
        return v1.valueOf() === v2.valueOf();
    }

    protected optionsEqual(o1: DateFormatterOptions, o2: DateFormatterOptions): boolean {
        if (!o1) {
            return !o2;
        }
        if (!o2) {
            return false;
        }
        return o1.date === o2.date
            && o1.datetime === o2.datetime
            && o1.raw === o2.raw
            && o1.skeleton === o2.skeleton
            && o1.time === o2.time
            && o1.timeZone === o2.timeZone;
    }
}
