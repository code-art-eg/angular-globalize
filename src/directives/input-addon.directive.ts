import { Directive, ElementRef, Input, Inject, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[caInputAddon]'
})
export class InputAddonDirective implements OnInit {

    private addonSpan: any;

    constructor(@Inject(ElementRef) private readonly el: ElementRef,
        @Inject(Renderer2) private readonly renderer: Renderer2) {
        this.type = 'calendar';
    }

    ngOnInit() {
        let parent = this.renderer.parentNode(this.el.nativeElement);
        let container = this.renderer.createElement('span');
        this.renderer.addClass(container, 'input-group');
        this.renderer.insertBefore(parent, container, this.el.nativeElement);

        this.renderer.appendChild(container, this.el.nativeElement); 

        let element = this.renderer.createElement('span');
        this.renderer.addClass(element, 'input-group-addon');
        this.renderer.appendChild(container, element);

        let childElement = this.renderer.createElement('span');
        this.renderer.addClass(childElement, 'glyphicon');
        this.renderer.appendChild(element, childElement);

        this.addonSpan = childElement;

        this.applyClass(null, this.type);
    }

    private applyClass(oldClass: string, newClass: string) {
        if (!this.addonSpan) {
            return;
        }
        if (oldClass) {
            this.renderer.removeClass(this.addonSpan, 'glyphicon-' + oldClass);
        }
        if (newClass) {
            this.renderer.addClass(this.addonSpan, 'glyphicon-' + newClass);
        }
    }


    private _type: string;
    @Input('caInputAddon') set type(val: string) {
        let newType = val || 'calendar';
        if (this._type !== newType) {
            this.applyClass(this._type, newType);
            this._type = newType;
        }
    };

    get type(): string {
        return this._type;
    }
}