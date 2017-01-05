import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SanitizedUrlPipe } from '../url';
import { IterablePipe } from '../iterable';

@NgModule({
    imports: [ ],
    declarations: [ SanitizedUrlPipe, IterablePipe ],
    exports: [ SanitizedUrlPipe, IterablePipe ]
})
export class PipesModule { }