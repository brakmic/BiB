import { AccessDenied } from './access-denied.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { DataResolver } from 'app/resolvers';

// WebpackAsyncRoute expects a route for this module to load  the Logon-Component
const routes: Routes = [
  {
    path: '', component: AccessDenied,
    resolve: {
      data: DataResolver
    },
    pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AccessDenied
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ]
})
export default class AccessDeniedModule {
  public static routes = routes;
}
