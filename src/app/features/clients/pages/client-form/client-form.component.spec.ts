import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { ClientFormComponent } from './client-form.component';
import { ClientService } from '../../../../core/services/client.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

describe('ClientFormComponent', () => {
  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ClientFormComponent>>;

  beforeEach(async () => {
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['createClient']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ClientFormComponent
      ],
      providers: [
        FormBuilder,
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.clientForm.get('name')?.value).toBe('');
    expect(component.clientForm.get('email')?.value).toBe('');
    expect(component.clientForm.get('phone')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const nameControl = component.clientForm.get('name');
    const emailControl = component.clientForm.get('email');
    
    nameControl?.setValue('');
    emailControl?.setValue('');
    
    expect(nameControl?.valid).toBeFalsy();
    expect(emailControl?.valid).toBeFalsy();
    expect(component.clientForm.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.clientForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should submit valid form', () => {
    clientServiceSpy.createClient.and.returnValue(of({
      id: '1',
      sharedKey: 'test123',
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      createdAt: new Date().toISOString()
    }));
    
    component.clientForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890'
    });
    
    component.onSubmit();
    
    expect(clientServiceSpy.createClient).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890'
    }));
    
    expect(dialogRefSpy.close).toHaveBeenCalledWith('created');
  });

  it('should not submit invalid form', () => {
    component.clientForm.setValue({
      name: '',
      email: 'invalid-email',
      phone: ''
    });
    
    component.onSubmit();
    
    expect(clientServiceSpy.createClient).not.toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close modal when closeModal is called', () => {
    component.closeModal();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should generate shared key from email', () => {
    clientServiceSpy.createClient.and.returnValue(of({
      id: '1',
      sharedKey: 'test.user',
      name: 'Test User',
      email: 'test.user@example.com',
      phone: '1234567890',
      createdAt: new Date().toISOString()
    }));

    const generateSharedKey = spyOn<any>(component, 'generateSharedKey').and.returnValue('test.user');
    
    component.clientForm.setValue({
      name: 'Test User',
      email: 'test.user@example.com',
      phone: '1234567890'
    });
    
    component.onSubmit();
    
    expect(generateSharedKey).toHaveBeenCalledWith('test.user@example.com');
    
    expect(clientServiceSpy.createClient).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test.user@example.com',
      phone: '1234567890',
      sharedKey: 'test.user'
    });
  });
});
