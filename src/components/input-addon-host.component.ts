import { Component, Inject, Renderer2, ElementRef, AfterViewInit, ViewChild } from "@angular/core";

@Component({
    templateUrl: './templates/input-addon-host.component.html',
    styleUrls: ['./styles/input-addon-host.component.less']
})
export class InputAddonHostComponent implements AfterViewInit {

    @ViewChild("inputhost") inputHost: ElementRef;
    hostedElement: ElementRef;

    constructor(@Inject(Renderer2) private readonly renderer: Renderer2) {
        this.type = 'calendar';
    }

    type: string;

    ngAfterViewInit(): void {

        const parent = this.renderer.parentNode(this.inputHost.nativeElement);

        let element = this.hostedElement.nativeElement;
        while (element.newNativeElement) {
            element = element.newNativeElement;
        }
        element.newNativeElement = parent;

        const oldParent = this.renderer.parentNode(element);
        const oldSibling = this.renderer.nextSibling(element);

        this.renderer.insertBefore(parent, element, this.inputHost.nativeElement);
        if (oldParent) {
            if (oldSibling) {
                this.renderer.insertBefore(oldParent, parent, oldSibling);
            } else {
                this.renderer.appendChild(oldParent, parent);
            }
        }
    }
}