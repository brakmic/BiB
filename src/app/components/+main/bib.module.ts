import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslationProvider } from '../../providers';

import { AUTH_PROVIDERS, NoContent,
         Signup, ReaderStatusComponent,
         ReaderComponent, BorrowComponent,
         MediaComponent, SidebarMenuComponent,
         HomeComponent, UsersComponent, BibDynamicComponent,
         ManageMediumComponent, BorrowMediaComponent,
         ManageReaderComponent, ManageUserComponent,
         DatabaseComponent, SessionInfoComponent,
         AclComponent, StatsModule } from '../shared';
import { BIB_DIRECTIVES } from '../../base';
import { LogService } from '../../services/log';
import { BibComponent } from './bib.component';
import { BIB_ROUTES } from './bib.routes';
import { AppPipesModule } from '../../pipes';

const CHILD_COMPONENTS = [
    NoContent,
    Signup,
    ReaderComponent,
    BorrowComponent,
    ReaderStatusComponent,
    MediaComponent,
    SidebarMenuComponent,
    HomeComponent,
    UsersComponent,
    ManageMediumComponent,
    ManageReaderComponent,
    BorrowMediaComponent,
    ManageUserComponent,
    BibDynamicComponent,
    DatabaseComponent,
    SessionInfoComponent,
    AclComponent
];


// WebpackAsyncRoute expects a route for this module to load  the Retail-Component
export const routes: Routes = BIB_ROUTES;

@NgModule({
  declarations: [
    BibComponent,
    ...CHILD_COMPONENTS,
    ...BIB_DIRECTIVES
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
    StatsModule,
    AppPipesModule
  ],
  providers: [
    ...AUTH_PROVIDERS
  ]
})
export class BibModule {
  public static routes = routes;
  constructor(private logService: LogService) {
  }
}
