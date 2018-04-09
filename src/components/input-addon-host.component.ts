import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, Renderer2, ViewChild } from "@angular/core";
import { CANG_CULTURE_SERVICE, ICultureService } from "@code-art/angular-globalize";
import { Subscription } from "rxjs/Subscription";

@Component({
    templateUrl: "./templates/input-addon-host.component.html",
})
export class InputAddonHostComponent implements AfterViewInit, OnDestroy {
    @ViewChild("inputhost") public inputHost: ElementRef;
    public type: string;
    public hostedElement: ElementRef;
    private readonly _sub: Subscription;

    constructor(@Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService,
                @Inject(Renderer2) private readonly renderer: Renderer2) {
        this.type = "calendar";

        this._sub = this.cultureService.cultureObservable.subscribe(() => {
            this.applyStyles();
        });
    }

    public ngOnDestroy(): void {
        this._sub.unsubscribe();
    }

    public ngAfterViewInit(): void {

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
        this.applyStyles();
    }

    // noinspection JSMethodCanBeStatic
    public getRtlControlStyle(): { [key: string]: string } {
        return {
            "border-bottom-left-radius": "0px",
            "border-bottom-right-radius": "4px",
            "border-top-left-radius": "0px",
            "border-top-right-radius": "4px",
        };
    }

    public getAddonStyle(): { [key: string]: string } {
        if (this.cultureService.isRightToLeft()) {
            return {
                "border-bottom-left-radius": "4px",
                "border-bottom-right-radius": "0",
                "border-left": "1px solid rgb(204, 204, 204)",
                "border-right-width": "0",
                "border-top-left-radius": "4px",
                "border-top-right-radius": "0",
            };
        }
        return {};
    }

    private applyStyles(): void {
        if (this.hostedElement) {
            const s = this.getRtlControlStyle();
            const rtl = this.cultureService.isRightToLeft();
            for (const key in s) {
                if (s.hasOwnProperty(key)) {
                    if (rtl) {
                        this.renderer.setStyle(this.hostedElement.nativeElement, key, s[key]);
                    } else {
                        this.renderer.removeStyle(this.hostedElement.nativeElement, key);
                    }
                }
            }
        }
    }
}
