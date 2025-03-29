import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, switchMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Client } from 'src/app/core/models/client';
import { ClientService } from 'src/app/core/services/client.service';
import { ClientFilters } from 'src/app/core/models/clientFilters';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  styleUrls: ['./client-list.component.css'],
  standalone: true
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);

  searchControl = new FormControl('');
  filters: ClientFilters = {};
  clients$: Observable<Client[]> = of([]);
  showAdvanced = false;

  displayedColumns: string[] = ['sharedKey', 'name', 'email', 'phone', 'createdAt'];

  ngOnInit(): void {
    this.clients$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => {
        if (value && value.trim()) {
          return this.clientService.searchClients(value.trim());
        } else {
          return this.clientService.getClients();
        }
      })
    );
  }

  toggleAdvancedSearch(): void {
    this.showAdvanced = !this.showAdvanced;
  }

  applyFilters(filters: ClientFilters): void {
    this.filters = filters;
    this.clients$ = this.clientService.getFilteredClients(this.filters).pipe(
      map(result => Array.isArray(result) ? result : [result])
    );
  }

  export(format: 'CSV' | 'EXCEL'): void {
    const exportParams = {
      ...this.filters,
      exportFormat: format
    };
    this.clientService.exportClients(exportParams).subscribe(blob => {
      const file = new Blob([blob], {
        type: format === 'CSV' ? 'text/csv' :
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = `clients.${format === 'CSV' ? 'csv' : 'xlsx'}`;
      a.click();
    });
  }

  trackByClient(index: number, client: Client): string {
    return client.id!;
  }
}
