import { Transaction } from './transaction.interface';

export interface Wallet {
    id?: number;
    name: string;
    balance: number;
}