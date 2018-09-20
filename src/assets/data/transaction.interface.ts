export interface Transaction {
    id?: number;
    name: string;
    value: number;
    date: string;
    category?: string;
    type?: number;
    wallet: number;
}