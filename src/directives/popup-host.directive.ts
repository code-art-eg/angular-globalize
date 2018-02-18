import { Directive, ViewContainerRef, Inject } from "@angular/core";


@Directive({
    selector: 'popup-host'
})
export class PopupHostDirective {
    constructor(@Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef) {
    }
}
