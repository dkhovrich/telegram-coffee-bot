import mysql, { Connection } from "mysql2/promise";
import z from "zod";
import { ConfigService } from "../services/config.service.mjs";

const transaction = z.object({
    id: z.number(),
    type: z.union([z.literal("add"), z.literal("recycle")]),
    amount: z.number(),
    capsules: z.number(),
    user: z.string(),
    createdAt: z.date()
});

const transactions = z.array(transaction);

export type Transaction = z.infer<typeof transaction>;

export type AddTransactionModel = Omit<Transaction, "id" | "createdAt">;

export class StorageRepository {
    public constructor(private readonly config: ConfigService) {}

    public async createTable(): Promise<void> {
        const sql = `
CREATE TABLE IF NOT EXISTS transactions 
  ( 
     id         INT NOT NULL AUTO_INCREMENT, 
     type       VARCHAR(255) NOT NULL, 
     amount     INT NOT NULL, 
     capsules   INT NOT NULL, 
     user       VARCHAR(255) NOT NULL, 
     createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
     PRIMARY KEY (id),
     INDEX created_at_index (createdAt)
  ) `;
        await this.query(async connection => {
            await connection.query(sql);
        });
    }

    public async getLastTransaction(): Promise<Transaction | null> {
        return await this.query(async connection => {
            const [rows] = await connection.query("SELECT * FROM transactions ORDER BY createdAt DESC LIMIT 1");
            const parsed = transactions.parse(rows);
            return parsed.at(0) ?? null;
        });
    }

    public async addTransaction(transaction: AddTransactionModel): Promise<void> {
        await this.query(connection => connection.query("INSERT INTO transactions SET ?", transaction));
    }
    private async query<T>(fn: (connection: Connection) => Promise<T>): Promise<T> {
        let connection: Connection | null = null;
        try {
            connection = await mysql.createConnection({
                host: this.config.get("DB_HOST"),
                user: this.config.get("DB_USER"),
                password: this.config.get("DB_PASSWORD"),
                database: this.config.get("DB_NAME")
            });
            return fn(connection);
        } catch (error) {
            await connection?.end();
            throw error;
        }
    }
}
