import { AddTransactionModel, Storage, Transaction } from "./storage.types.mjs";
import { randomUUID } from "crypto";

export class StorageStub implements Storage {
    private transactions: Transaction[] = [];

    public getLastTransaction(): Promise<Transaction | null> {
        const transaction = this.transactions.at(-1);
        return Promise.resolve(transaction ?? null);
    }

    public addTransaction(transaction: AddTransactionModel): Promise<void> {
        this.transactions.push({ ...transaction, id: randomUUID(), createdAt: new Date() });
        return Promise.resolve(undefined);
    }
}
