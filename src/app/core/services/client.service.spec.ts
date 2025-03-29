import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { Client } from '../models/client';
import { environment } from 'src/environments/environment';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/clients`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService]
    });
    
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all clients', () => {
    const mockClients: Client[] = [
      { id: '1', sharedKey: 'client1', name: 'Test Client 1', email: 'test1@example.com', phone: '123456789', createdAt: new Date().toISOString() },
      { id: '2', sharedKey: 'client2', name: 'Test Client 2', email: 'test2@example.com', phone: '987654321', createdAt: new Date().toISOString() }
    ];

    service.getClients().subscribe(clients => {
      expect(clients).toEqual(mockClients);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockClients);
  });

  it('should get client by shared key', () => {
    const mockClient: Client = { 
      id: '1', 
      sharedKey: 'client1', 
      name: 'Test Client', 
      email: 'test@example.com', 
      phone: '123456789',
      createdAt: new Date().toISOString()
    };
    const sharedKey = 'client1';

    service.getClientBySharedKey(sharedKey).subscribe(client => {
      expect(client).toEqual(mockClient);
    });

    const req = httpMock.expectOne(`${apiUrl}/${sharedKey}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClient);
  });

  it('should create a new client', () => {
    const newClient: Partial<Client> = { 
      sharedKey: 'newclient', 
      name: 'New Client', 
      email: 'new@example.com', 
      phone: '555555555',
      createdAt: new Date().toISOString()
    };
    
    const createdClient: Client = { 
      id: '3',
      sharedKey: 'newclient', 
      name: 'New Client', 
      email: 'new@example.com', 
      phone: '555555555',
      createdAt: new Date().toISOString()
    };

    service.createClient(newClient as Client).subscribe(client => {
      expect(client).toEqual(createdClient);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newClient);
    req.flush(createdClient);
  });

  it('should handle errors', () => {
    service.getClients().subscribe({
      next: () => fail('should have failed with a 404'),
      error: (error) => {
        expect(error.message).toContain('404 Not Found');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
