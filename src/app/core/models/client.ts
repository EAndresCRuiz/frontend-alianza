export interface Client {
    id: string;
    sharedKey: string;
    name: string;
    email: string;
    phone?: string | null;
    createdAt: string;
}
