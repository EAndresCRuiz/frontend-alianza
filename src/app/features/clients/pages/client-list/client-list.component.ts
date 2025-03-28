import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/core/services/client.service';
import { Client } from 'src/app/core/models/client';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  imports: [MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule
  ],
  styleUrls: ['./client-list.component.css'],
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  searchControl = new FormControl('');

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
    this.setupSearch();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => console.error('Error cargando clientes', err),
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value) => {
        if (value) {
          this.clientService.getClientBySharedKey(value).subscribe({
            next: (client) => (this.clients = [client]),
            error: () => (this.clients = []),
          });
        } else {
          this.loadClients();
        }
      },
    });
  }
}

