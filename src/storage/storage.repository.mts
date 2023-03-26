import mysql, { Connection } from "mysql2/promise";
import z from "zod";
import { ConfigService } from "../services/config.service.mjs";

const transaction = z.object({
    id: z.number(),
    type: z.union([z.literal("add"), z.literal("recycle")]),
    amount: z.number(),
    capsules: z.number(),
    user: z.string(),
    created_at: z.date()
});

const transactions = z.array(transaction);

export type Transaction = z.infer<typeof transaction>;

export type AddTransactionModel = Omit<Transaction, "id" | "created_at">;

export class StorageRepository {
    public constructor(private readonly config: ConfigService) {}

    public async getLastTransaction(): Promise<Transaction | null> {
        const sql = "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 1";
        const connection = await this.createConnection();
        const [rows] = await connection.query(sql);
        const parsed = transactions.parse(rows);
        const transaction = parsed.at(0) ?? null;
        await connection.end();
        return transaction;
    }

    public async addTransaction(transaction: AddTransactionModel): Promise<void> {
        const connection = await this.createConnection();
        await connection.query("INSERT INTO transactions SET ?", transaction);
        await connection.end();
    }

    private createConnection(): Promise<Connection> {
        return mysql.createConnection({
            host: this.config.get("DB_HOST"),
            user: this.config.get("DB_USER"),
            password: this.config.get("DB_PASSWORD"),
            database: this.config.get("DB_NAME")
        });
    }
}
