import { Routes } from '@angular/router';
import { ClientListComponent } from './features/clients/pages/client-list/client-list.component';
import { ClientFormComponent } from './features/clients/pages/client-form/client-form.component';

export const routes: Routes = [
  { path: '', component: ClientListComponent },
  { path: 'new', component: ClientFormComponent },
  { path: '**', redirectTo: '' },
];
