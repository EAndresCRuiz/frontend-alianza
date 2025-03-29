import { Routes } from '@angular/router';
import { ClientListComponent } from './features/clients/pages/client-list/client-list.component';
import { ClientFormComponent } from './features/clients/pages/client-form/client-form.component';
import { LayoutComponent } from './features/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
      { path: 'clients', component: ClientListComponent },
      { path: 'new', component: ClientFormComponent },
    ]
  },
  { path: '**', redirectTo: '' },
];
