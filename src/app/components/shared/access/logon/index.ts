import { LogonComponent } from './logon.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { PipesModule } from 'app/pipes';

// WebpackAsyncRoute expects a route for this module to load  the Logon-Component
const routes: Routes = [
  {
    path: '',
    component: LogonComponent
  },
  {
    path: 'logon',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    LogonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    PipesModule
  ]
})
export default class LogonModule {
  public static routes = routes;
}
