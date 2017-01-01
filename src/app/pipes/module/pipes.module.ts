import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SanitizedUrlPipe } from '../url';

@NgModule({
    imports: [ ],
    declarations: [ SanitizedUrlPipe ],
    exports: [ SanitizedUrlPipe ]
})
export class PipesModule { }