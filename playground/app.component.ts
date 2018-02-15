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
        this.range = false;
        
        this.start = null;
        this.end = null;
        this.start2 = null;
        this.end2 = null;
        this.val = null;
    }
    date: Date;
    val: any;

    start: Date;
    end:Date;
    start2: Date;
    end2:Date;
    range: boolean;
    range2: boolean;
}
