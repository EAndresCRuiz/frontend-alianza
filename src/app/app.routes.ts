import { Routes } from '@angular/router';
import { ClientListComponent } from './features/clients/pages/client-list/client-list.component';

export const routes: Routes = [
  { path: '', component: ClientListComponent },
  { path: '**', redirectTo: '' },
];
