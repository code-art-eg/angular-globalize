import { IGlobalizationService } from '@code-art/angular-globalize';

export function applyMixins(derivedCtor: Function, ...baseCtors: Function[]) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            if (name === 'constructor') {
                return;
            }
            var pd = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            var fb;
            if (typeof pd.value === 'function' && !pd.get && !pd.set) {
                var fb_1 = pd.value;
                var fd_1 = derivedCtor.prototype[name];
                if (typeof fd_1 === 'function') {
                    derivedCtor.prototype[name] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        fb_1.apply(this, args);
                        fd_1.apply(this, args);
                    };
                }
                else {
                    derivedCtor.prototype[name] = fb_1;
                }
            }
            else if (pd) {
                Object.defineProperty(derivedCtor.prototype, name, pd);
            }
        });
    });
}

export function datesEqual(d1: Date | null | undefined, d2: Date | null | undefined): boolean {
    if (d1 === null || d1 === undefined)
        return d2 === null || d2 === undefined;
    if (d2 === null || d2 === undefined)
        return false;
    return d1.valueOf() === d2.valueOf();
}

export function createDate(year?: number, month?: number, date?: number): Date {
    let d = new Date();
    if (typeof year === 'undefined') {
        year = d.getFullYear();
    }
    if (typeof month === 'undefined') {
        month = d.getMonth();
    }
    if (typeof date === 'undefined') {
        date = d.getDate();
    }
    d = new Date(Date.UTC(year, month, date));
    if (d.getUTCFullYear() !== year) {
        d.setUTCFullYear(year);
    }
    return d;
}

export function similarInUtc(date: null): null;
export function similarInUtc(date: undefined): undefined;
export function similarInUtc(date: Date): Date;
export function similarInUtc(date: Date | null | undefined): Date | null | undefined {
    if (date === null) {
        return null;
    }
    if (date === undefined) {
        return undefined;
    }
    return createDate(date.getFullYear(), date.getMonth(), date.getDate());
}

export function similarInLocal(date: null): null;
export function similarInLocal(date: undefined): undefined;
export function similarInLocal(date: Date): Date;
export function similarInLocal(date: Date | null | undefined): Date | null | undefined {
    if (date === null) {
        return null;
    }
    if (date === undefined) {
        return undefined;
    }
    let d = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    if (date.getUTCFullYear() !== d.getFullYear()) {
        d.setFullYear(date.getUTCFullYear())
    }
    return d;
}

export function addDays(date: Date, days: number): Date {
    let newDate = new Date(date.valueOf() + days * 24 * 3600 * 1000);
    return newDate;
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

export function stripTime(val: undefined): undefined;
export function stripTime(val: null): null;
export function stripTime(val: Date): Date;
export function stripTime(val: Date | null | undefined): Date | null | undefined {
    if (val === null) {
        return null;
    }
    if (val === undefined) {
        return undefined;
    }
    return createDate(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate());
}


export function minDate(val: null, ...args: (Date | null | undefined)[]): null;
export function minDate(val: undefined, ...args: (Date | null | undefined)[]): undefined;
export function minDate(val: Date, ...args: (Date | null | undefined)[]): Date;
export function minDate(val: Date | null | undefined, ...args: (Date | null | undefined)[]): Date | null | undefined {
    if (val === null) {
        return null;
    }
    if (val === undefined) {
        return undefined;
    }
    let min = val;
    if (args) {
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (arg === undefined || arg === null)
                continue;
            let d = arg as Date;
            if (d.valueOf() < min.valueOf())
                min = d;
        }
    }
    return min;
}

export function maxDate(val: null, ...args: (Date | null | undefined)[]): null;
export function maxDate(val: undefined, ...args: (Date | null | undefined)[]): undefined;
export function maxDate(val: Date, ...args: (Date | null | undefined)[]): Date;
export function maxDate(val: Date | null | undefined, ...args: (Date | null | undefined)[]): Date | null | undefined {
    if (val === null) {
        return null;
    }
    if (val === undefined) {
        return undefined;
    }
    let max = val;
    if (args) {
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (arg === undefined || arg === null)
                continue;
            let d = arg as Date;
            if (d.valueOf() > max.valueOf())
                max = d;
        }
    }
    return max;
}

export function dateInRange(val: Date | null | undefined, min: Date | null | undefined, max: Date | null | undefined): boolean {
    if (val === null || val === undefined) {
        return true;
    }
    if (min && val.valueOf() < min.valueOf())
        return false;
    if (max && val.valueOf() > max.valueOf())
        return false;
    return true;
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

export type ViewType = 'days' | 'months' | 'years' | 'decades' | 'centuries' | 'home';
export type NextPrevAction = 'next' | 'prev' | 'text' | 'home' | 'reset';

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
    ENTER = 13
};

export interface IDateRange {
    from: Date,
    to: Date
}
