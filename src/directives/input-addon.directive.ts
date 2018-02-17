import { Directive, ElementRef, Input, Inject, Renderer2, OnInit, ComponentFactoryResolver, ViewContainerRef, ComponentRef, OnDestroy } from '@angular/core';
import { InputAddonHostComponent } from '../components/input-addon-host.component';

@Directive({
    selector: '[caInputAddon]'
})
export class InputAddonDirective implements OnInit, OnDestroy {

    private componentRef: ComponentRef<InputAddonHostComponent>;


    constructor(@Inject(ComponentFactoryResolver) private readonly resolver: ComponentFactoryResolver,
        @Inject(ViewContainerRef) private readonly viewContainerRef: ViewContainerRef,
        @Inject(ElementRef) private readonly el: ElementRef) {
        
    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    ngOnInit() {

        const factory = this.resolver.resolveComponentFactory(InputAddonHostComponent);
        this.componentRef = this.viewContainerRef.createComponent(factory);
        this.componentRef.instance.hostedElement = this.el;
        
        
        this.componentRef.instance.type = this.type;
    }

    private _type = 'calendar';
    get type(): string {
        return this._type || 'calendar';
    }

    @Input('caInputAddon') set type(val: string) {
        this._type = val;
        if (this.componentRef) {
            this.componentRef.instance.type = val || 'calendar';
        }
    }
}