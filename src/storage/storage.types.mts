import z from "zod";

export const transactionScheme = z.object({
    id: z.string(),
    type: z.union([z.literal("add"), z.literal("recycle")]),
    amount: z.number(),
    capsules: z.number(),
    user: z.string(),
    createdAt: z.date()
});

export type Transaction = z.infer<typeof transactionScheme>;

export type AddTransactionModel = Omit<Transaction, "id" | "createdAt">;

export interface Storage {
    getLastTransaction(): Promise<Transaction | null>;
    addTransaction(transaction: AddTransactionModel): Promise<void>;
}
