import {
    Component, ComponentFactoryResolver,
    ComponentRef, ElementRef, HostListener, Inject, Renderer2, ViewChild,
} from '@angular/core';
import { PopupHostDirective } from '../../directives/popup-host.directive';
import { IBaseValueAccessor, IComponentFocus, IPopupComponent, IPopupDirective } from '../../interfaces';

@Component({
    styleUrls: ['./popup.component.less'],
    templateUrl: './popup.component.html',
})
export class PopupComponent implements IPopupComponent<any> {
    public hostedElement: ElementRef;
    public popupDirective: IPopupDirective<any>;
    @ViewChild('inputhost') public inputHost: ElementRef;

    private _mouseIn = false;
    private componentRef: ComponentRef<IBaseValueAccessor<any>>;
    private _show = false;
    private _componenthost: PopupHostDirective;
    private _mouseOutTimeOut: any;

    constructor(@Inject(Renderer2) private readonly renderer: Renderer2,
                @Inject(ComponentFactoryResolver) private readonly resolver: ComponentFactoryResolver) {
        this._mouseOutTimeOut = null;
    }

    @ViewChild(PopupHostDirective) set componenthost(val: PopupHostDirective) {
        if (val !== this._componenthost) {
            if (this.componentRef) {
                this.componentRef.destroy();
                this.componentRef = null;
            }
            this._componenthost = val;
            if (val) {
                this.componentRef =
                    this._componenthost.viewContainerRef.createComponent(
                        this.popupDirective.resolveFactory(this.resolver));
                this.popupDirective.addBoundChild(this.componentRef.instance);
            }
        }
    }

    get componenthost(): PopupHostDirective {
        return this._componenthost;
    }

    @HostListener('mouseenter')
    public mouseEnter(): void {
        this._mouseIn = true;
        if (this._mouseOutTimeOut) {
            clearTimeout(this._mouseOutTimeOut);
            this._mouseOutTimeOut = null;
        }
    }

    @HostListener('mouseleave')
    public mouseLeave(): void {
        this._mouseOutTimeOut = setTimeout(() => {
            this._mouseIn = false;
            this._mouseOutTimeOut = null;
        }, 200);
    }

    set show(val: boolean) {
        if (this._show !== val) {
            this._show = val;
        }
    }

    get show(): boolean {
        return this._show;
    }

    get focus(): boolean {
        if (this.componentRef) {
            if (this.componentRef.instance) {
                const focusable = this.componentRef.instance as IComponentFocus;
                if (focusable.focus === true) {
                    return true;
                }
            }
        }
        return false;
    }

    get isVisible(): boolean {
        return this._show || this._mouseIn || this.focus;
    }

    get orientTop(): boolean {
        return this.popupDirective.orientTop;
    }

    get orientRight(): boolean {
        return this.popupDirective.orientRight;
    }

    get bottom(): string {
        if (!this.orientTop) {
            return null;
        }
        const el = this.hostedElement.nativeElement as HTMLElement;
        if (!el) {
            return null;
        }
        const parent = el.offsetParent as HTMLElement;
        if (!parent) {
            return null;
        }
        const bottom = parent.offsetHeight - el.offsetTop;
        return `${bottom}px`;
    }

    get top(): string {
        if (this.orientTop) {
            return null;
        }
        const el = this.hostedElement.nativeElement as HTMLElement;
        if (!el) {
            return null;
        }
        const top = el.offsetTop + el.offsetHeight;
        return `${top}px`;
    }

    get right(): string {
        if (!this.orientRight) {
            return null;
        }
        const el = this.hostedElement.nativeElement as HTMLElement;
        if (!el) {
            return null;
        }
        const parent = el.offsetParent as HTMLElement;
        if (!parent) {
            return null;
        }
        const right = parent.offsetWidth - (el.offsetLeft + el.offsetWidth);
        return `${right}px`;
    }

    get left(): string {
        if (this.orientRight) {
            return null;
        }
        const el = this.hostedElement.nativeElement as HTMLElement;
        if (!el) {
            return null;
        }
        const left = el.offsetLeft;
        return `${left}px`;
    }
}
