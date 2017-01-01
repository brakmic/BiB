import { Routes, RouterModule } from '@angular/router';
import { BibComponent } from './bib.component';
import { NoContent, AuthGuard,
         ReaderStatusComponent,
         MediaComponent, ReaderComponent,
         BorrowComponent, HomeComponent,
         UsersComponent, DatabaseComponent } from 'app/components/shared';
import { DataResolver } from 'app/resolvers';

export const BIB_ROUTES: Routes = [
  {
    path: '',
    component: BibComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'status',
        component: ReaderStatusComponent,
        resolve: {
          readers: DataResolver
        }
      },
      {
        path: 'media',
        component: MediaComponent,
        resolve: {
          media: DataResolver
        }
      },
      {
        path: 'readers',
        component: ReaderComponent,
        resolve: {
          readers: DataResolver
        }
      },
      {
        path: 'borrows',
        component: BorrowComponent,
        resolve: {
          borrows: DataResolver
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        resolve: {
          users: DataResolver
        }
      },
      {
        path: 'database',
        component: DatabaseComponent,
        resolve: {
          database: DataResolver
        }
      },
      {
        path: 'logout',
        redirectTo: 'logon',
        pathMatch: 'full'
      },
      {
        path: ':selection',
        component: NoContent,
      },
      {
        path: '**', component: NoContent
      }
    ]
  }
];
