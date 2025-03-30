import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Client } from 'src/app/core/models/client';
import { ClientService } from 'src/app/core/services/client.service';
import { ClientFilters } from 'src/app/core/models/clientFilters';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormComponent } from 'src/app/features/clients/pages/client-form/client-form.component';

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
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  searchControl = new FormControl('');
  advancedFiltersForm: FormGroup = new FormGroup({});
  filters: ClientFilters = {};
  clients$: Observable<Client[]> = of([]);
  showAdvanced = false;

  displayedColumns: string[] = ['sharedKey', 'name', 'email', 'phone', 'createdAt'];

  ngOnInit(): void {
    this.advancedFiltersForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      startDate: [''],
      endDate: ['']
    });

    this.initSearchListener();
  }

  initSearchListener(): void {
    this.clients$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => {
        console.log("cambia el search")
        if (value && value.trim()) {
          return this.clientService.searchClients(value.trim()).pipe(
            catchError(error => {
              console.error('Error searching clients:', error);
              return of([]);//return empty array on error to keep the stream alive
            })
          );
        } else {
          return this.clientService.getClients().pipe(
            catchError(error => {
              console.error('Error fetching clients:', error);
              return of([]);//return empty array on error to keep the stream alive
            })
          );
        }
      })
    );
  }

  toggleAdvancedSearch(): void {
    this.showAdvanced = !this.showAdvanced;
  }

  applyFilters(): void {
    const raw = this.advancedFiltersForm.value;

    this.filters = {
      name: raw.name || null,
      email: raw.email || null,
      phone: raw.phone || null,
      startDate: raw.startDate ? this.formatDate(raw.startDate) : undefined,
      endDate: raw.endDate ? this.formatDate(raw.endDate) : undefined
    };

    this.clients$ = this.clientService.getFilteredClients(this.filters).pipe(
      map(result => Array.isArray(result) ? result : [result]),
      catchError(error => {
        console.error('Error applying filters:', error);
        return of([]);
      })
    );
  }

  clearFilters(): void {
    this.advancedFiltersForm.reset();
    this.filters = {};
    this.initSearchListener();//init listener to keep the stream alive
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0]; //yyyy-MM-dd
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

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.initSearchListener();//init listener to keep the stream alive
      }
    });
  }
}
