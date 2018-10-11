import { ChangeDetectorRef } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

export class ChangeDetectorMock extends ChangeDetectorRef {

    public readonly changeObservable: Observable<number>;
    private readonly changeSubject: ReplaySubject<number>;
    private markCountInternal: number;

    constructor() {
        super();
        this.markCountInternal = 0;
        this.changeSubject = new ReplaySubject(1);
        this.changeObservable = this.changeSubject.asObservable();
    }

    public get markCount(): number {
        return this.markCountInternal;
    }

    public markForCheck(): void {
        this.markCountInternal++;
        this.changeSubject.next(this.markCountInternal);
    }

    public detach(): void {
        //
    }

    public detectChanges(): void {
        //
    }

    public checkNoChanges(): void {
        //
    }

    public reattach(): void {
        //
    }
}
