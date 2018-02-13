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
        this.date = new Date();
        this.val = new Date();
    }
    date: Date;
    val: any;
}
