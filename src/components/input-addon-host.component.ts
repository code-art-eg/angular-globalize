import { Component, Inject, Renderer2, ElementRef } from "@angular/core";

@Component({
    templateUrl: './input-addon-host.component.html',
    styleUrls: ['./input-addon-host.component.less']
})
export class InputAddonHostComponent {

    constructor(@Inject(ElementRef) readonly el: ElementRef,
        @Inject(Renderer2) readonly renderer: Renderer2) {
        this.type = 'calendar';
    }

    type: string;
}