import { Directive, Inject, ViewContainerRef } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'cadp-popup-host',
})
export class PopupHostDirective {
    constructor(@Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef) {
    }
}
