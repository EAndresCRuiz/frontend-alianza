import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from 'src/app/core/services/client.service';
import { Client } from 'src/app/core/models/client';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-client-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
  standalone: true,
})
export class ClientFormComponent {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private dialogRef = inject(MatDialogRef<ClientFormComponent>);

  clientForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
    email: ['', [Validators.required, Validators.email]],
  });

  errorMessage: string | null = null;
  success = false;

  onSubmit(): void {
    if (this.clientForm.invalid) return;

    const formValue = this.clientForm.value;
    const newClient: Client = {
      sharedKey: this.generateSharedKey(formValue.email),
      name: formValue.name,
      phone: formValue.phone || null,
      email: formValue.email
    };

    this.clientService.createClient(newClient).subscribe({
      next: () => {
        this.success = true;
        this.clientForm.reset();
        this.dialogRef.close('created');
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al crear cliente.';
      }
    });
  }

  private generateSharedKey(email: string): string {
    const username = email.split('@')[0];
    return username.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  closeModal(): void {
    this.dialogRef.close();
  }
  
}
