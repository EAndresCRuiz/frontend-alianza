import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ClientFormComponent } from './client-form.component';
import { ClientService } from '../../../../core/services/client.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('ClientFormComponent', () => {
  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['createClient']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

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
        { provide: Router, useValue: routerSpy }
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
    expect(component.clientForm.get('sharedKey')?.value).toBe('');
    expect(component.clientForm.get('name')?.value).toBe('');
    expect(component.clientForm.get('email')?.value).toBe('');
    expect(component.clientForm.get('phone')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const sharedKeyControl = component.clientForm.get('sharedKey');
    const nameControl = component.clientForm.get('name');
    const emailControl = component.clientForm.get('email');
    
    sharedKeyControl?.setValue('');
    nameControl?.setValue('');
    emailControl?.setValue('');
    
    expect(sharedKeyControl?.valid).toBeFalsy();
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
      sharedKey: 'test123',
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890'
    });
    
    component.onSubmit();
    
    expect(clientServiceSpy.createClient).toHaveBeenCalledWith(jasmine.objectContaining({
      sharedKey: 'test123',
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890'
    }));
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not submit invalid form', () => {
    component.clientForm.setValue({
      sharedKey: '',
      name: '',
      email: 'invalid-email',
      phone: ''
    });
    
    component.onSubmit();
    
    expect(clientServiceSpy.createClient).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
