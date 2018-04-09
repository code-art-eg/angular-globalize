import { Component } from "@angular/core";
import "rxjs/add/observable/timer";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

@Component({
    selector: "app",
    templateUrl: "./app.component.html",
})
export class AppComponent {
    public jsDate: Date;
    public currentTime: Observable<Date>;

    constructor() {
        this.jsDate = new Date();
        this.currentTime = Observable.timer(0, 1000).map(() => new Date());
    }
}
