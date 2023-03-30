import z from "zod";

export const transaction = z.object({
    id: z.number(),
    type: z.union([z.literal("add"), z.literal("recycle")]),
    amount: z.number(),
    capsules: z.number(),
    user: z.string(),
    createdAt: z.date()
});

export const transactions = z.array(transaction);

export type Transaction = z.infer<typeof transaction>;

export interface StorageService {
    init(): Promise<void>;
    get(): Promise<number>;
    add(amount: number, user: string): Promise<number>;
    recycle(user: string): Promise<void>;
}
