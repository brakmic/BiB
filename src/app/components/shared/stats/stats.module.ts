import { StatsComponent } from './stats.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { AppPipesModule } from 'app/pipes';

@NgModule({
  declarations: [
    StatsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AppPipesModule
  ],
  exports: [
      StatsComponent
  ]
})
export class StatsModule {
}
