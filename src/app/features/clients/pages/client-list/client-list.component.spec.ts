import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClientListComponent } from './client-list.component';
import { ClientService } from 'src/app/core/services/client.service';
import { of } from 'rxjs';

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;

  beforeEach(async () => {
    clientServiceSpy = jasmine.createSpyObj('ClientService', ['getClients', 'getClientBySharedKey']);
    clientServiceSpy.getClients.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        ClientListComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatTableModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ClientService, useValue: clientServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
