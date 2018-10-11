import { Directive, Inject, ViewContainerRef } from "@angular/core";

@Directive({
    selector: "popup-host",
})
export class PopupHostDirective {
    constructor(@Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef) {
    }
}
