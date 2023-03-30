import z from "zod";
import { AddTransactionModel } from "./storage.repository.sql.mjs";

export const transactionScheme = z.object({
    id: z.string(),
    type: z.union([z.literal("add"), z.literal("recycle")]),
    amount: z.number(),
    capsules: z.number(),
    user: z.string(),
    createdAt: z.date()
});

export const transactionsScheme = z.array(transactionScheme);

export type Transaction = z.infer<typeof transactionScheme>;

export interface StorageService {
    init(): Promise<void>;
    get(): Promise<number>;
    add(amount: number, user: string): Promise<number>;
    recycle(user: string): Promise<void>;
}

export interface StorageRepository {
    init(): Promise<void>;
    getLastTransaction(): Promise<Transaction | null>;
    addTransaction(transaction: AddTransactionModel): Promise<void>;
}
