import { NgModule } from '@angular/core';
import { ICON_COMPONENTS } from './components/icons';
import { NextPreviousComponent } from './components/next-prev/next-prev.component';

@NgModule({
  imports: [
  ],
  declarations: [
    ICON_COMPONENTS,
    NextPreviousComponent,
  ],
  exports: [],
})
export class AngularDatepickerModule { }
