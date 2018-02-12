import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent
{
    constructor() {
        this.jsDate = new Date();
        this.currentTime = Observable.timer(0, 1000).map(v => new Date());
    }

    jsDate: Date;
    currentTime: Observable<Date>;
}
