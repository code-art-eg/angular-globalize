import { IGlobalizationService } from "@code-art/angular-globalize";

// tslint:disable-next-line: ban-types
export function applyMixins(derivedCtor: Function, ...baseCtors: Function[]) {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (name === "constructor") {
                return;
            }
            const pd = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            if (typeof pd.value === "function" && !pd.get && !pd.set) {
                const fb1 = pd.value;
                const fd1 = derivedCtor.prototype[name];
                if (typeof fd1 === "function") {
                    derivedCtor.prototype[name] = function() {
                        const args = [];
                        for (let i = 0; i < arguments.length; i++) {
                            args[i] = arguments[i];
                        }
                        fb1.apply(this, args);
                        fd1.apply(this, args);
                    };
                } else {
                    derivedCtor.prototype[name] = fb1;
                }
            } else if (pd) {
                Object.defineProperty(derivedCtor.prototype, name, pd);
            }
        });
    });
}

export function isPlainObject(val: any): boolean {
    if (!val) { return false; }
    return typeof val === "object"
        && val.constructor === Object;
}

export function datesEqual(d1: Date | null | undefined, d2: Date | null | undefined): boolean {
    if (d1 === null || d1 === undefined) {
        return d2 === null || d2 === undefined;
    }
    if (d2 === null || d2 === undefined) {
        return false;
    }
    return d1.valueOf() === d2.valueOf();
}

export function createDate(year?: number, month?: number, date?: number): Date {
    let d = new Date();
    if (typeof year === "undefined") {
        year = d.getFullYear();
    }
    if (typeof month === "undefined") {
        month = d.getMonth();
    }
    if (typeof date === "undefined") {
        date = d.getDate();
    }
    d = new Date(Date.UTC(year, month, date));
    if (d.getUTCFullYear() !== year) {
        d.setUTCFullYear(year);
    }
    return d;
}

export function similarInUtc(date: Date): Date {
    if (date === null) {
        return null;
    }
    if (date === undefined) {
        return undefined;
    }
    return createDate(date.getFullYear(), date.getMonth(), date.getDate());
}

export function similarInLocal(date: Date): Date {
    if (date === null) {
        return null;
    }
    if (date === undefined) {
        return undefined;
    }
    const d = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    if (date.getUTCFullYear() !== d.getFullYear()) {
        d.setFullYear(date.getUTCFullYear());
    }
    return d;
}

export function addDays(date: Date, days: number): Date {
    return new Date(date.valueOf() + days * 24 * 3600 * 1000);
}

export function formatYear(service: IGlobalizationService, year: number, locale?: string): string {
    let res = service.formatNumber(year, locale, { useGrouping: false });
    if (res.length < 4) {
        const zero = service.formatNumber(0, locale, { useGrouping: false });
        while (res.length < 4) {
            res = zero + res;
        }
    }
    return res;
}

export function formatTimeComponent(service: IGlobalizationService, val: number, locale?: string): string {
    let res = service.formatNumber(val, locale, { useGrouping: false });
    if (res.length < 2) {
        const zero = service.formatNumber(0, locale, { useGrouping: false });
        res = zero + res;
    }
    return res;
}

export function stripTime(val: Date): Date {
    if (val === null) {
        return null;
    }
    if (val === undefined) {
        return undefined;
    }
    return createDate(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate());
}

export function minDate(val: Date, ...args: Date[]): Date {
    if (val === null) {
        return null;
    }
    if (val === undefined) {
        return undefined;
    }
    let min = val;
    if (args) {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg === undefined || arg === null) {
                continue;
            }
            const d = arg as Date;
            if (d.valueOf() < min.valueOf()) {
                min = d;
            }
        }
    }
    return min;
}

export function maxDate(val: Date,
                        ...args: Date[]): Date {
    if (val === null) {
        return null;
    }
    if (val === undefined) {
        return undefined;
    }
    let max = val;
    if (args) {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg === undefined || arg === null) {
                continue;
            }
            const d = arg as Date;
            if (d.valueOf() > max.valueOf()) {
                max = d;
            }
        }
    }
    return max;
}

export function dateInRange(val: Date | null | undefined,
                            min: Date | null | undefined,
                            max: Date | null | undefined): boolean {
    if (val === null || val === undefined) {
        return true;
    }
    if (min && val.valueOf() < min.valueOf()) {
        return false;
    }
    return !(max && val.valueOf() > max.valueOf());
}

export function numArray(length: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < length; i++) {
        result.push(i);
    }
    return result;
}

export function getMonthYear(month: number | null, year: number): [number | null, number] {
    if (month === null || month === undefined) {
        return [null, year];
    }
    if (month < 0 || month > 11) {
        const dy = Math.floor(month / 12);
        month = month - dy * 12;
        year += dy;
    }
    return [month, year];
}

export type ViewType = "days" | "months" | "years" | "decades" | "centuries" | "home";
export type NextPrevAction = "next" | "prev" | "text" | "home" | "reset";

export interface IMonthYearSelection {
    month?: number;
    year?: number;
    view?: ViewType;
    reset?: boolean;
}

export const sevenArray = numArray(7);
export const sixArray = numArray(6);
export const twelveArray = numArray(12);

export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37,
    UP_ARROW = 38,
    DOWN_ARROW = 40,
    ENTER = 13,
}

export interface IDateRange {
    from: Date;
    to: Date;
}
