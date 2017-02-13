import { NgModule } from '@angular/core';
import { APP_PIPES } from '../base';

@NgModule({
  imports: [],
  exports: [ ...APP_PIPES ],
  declarations: [
    ...APP_PIPES
  ],
  providers: [

  ],
})
export class AppPipesModule { }
