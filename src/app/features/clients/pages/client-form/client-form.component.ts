import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from 'src/app/core/services/client.service';
import { Client } from 'src/app/core/models/client';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-client-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
  standalone: true,
})
export class ClientFormComponent {
  clientForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      sharedKey: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    const newClient: Client = {
      ...this.clientForm.value,
      id: '',
      createdAt: new Date().toISOString(),
    };

    this.clientService.createClient(newClient).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMessage = err.error.message || 'Error al crear cliente';
      },
    });
  }
}
