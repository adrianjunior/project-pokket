export interface Transaction {
    id?: number;
    name: string;
    value: number;
    date: string;
    category: number;
    type?: string;
}