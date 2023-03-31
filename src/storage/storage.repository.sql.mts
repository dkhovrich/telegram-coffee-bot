import mysql, { Connection } from "mysql2/promise";
import { v4 } from "uuid";
import { ConfigService } from "../services/config.service.mjs";
import { StorageRepository, Transaction, transactionsScheme } from "./storage.types.mjs";

export type AddTransactionModel = Omit<Transaction, "id" | "createdAt">;

export class StorageRepositorySql implements StorageRepository {
    public constructor(private readonly config: ConfigService) {}

    public async init(): Promise<void> {
        const sql = `
CREATE TABLE IF NOT EXISTS transactions 
  ( 
     id         VARCHAR(255) NOT NULL PRIMARY KEY, 
     type       VARCHAR(255) NOT NULL, 
     amount     INT NOT NULL, 
     capsules   INT NOT NULL, 
     user       VARCHAR(255) NOT NULL, 
     createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     INDEX created_at_index (createdAt)
  ) `;
        await this.query(async connection => {
            await connection.query(sql);
        });
    }

    public async getLastTransaction(): Promise<Transaction | null> {
        return await this.query(async connection => {
            const [rows] = await connection.query("SELECT * FROM transactions ORDER BY createdAt DESC LIMIT 1");
            const parsed = transactionsScheme.parse(rows);
            return parsed.at(0) ?? null;
        });
    }

    public async addTransaction(transaction: AddTransactionModel): Promise<void> {
        await this.query(connection =>
            connection.query("INSERT INTO transactions SET ?", { id: v4(), ...transaction })
        );
    }

    private async query<T>(fn: (connection: Connection) => Promise<T>): Promise<T> {
        let connection: Connection | null = null;
        try {
            connection = await mysql.createConnection({
                host: this.config.get("SQL_DATABASE_HOST"),
                user: this.config.get("SQL_DATABASE_USER"),
                password: this.config.get("SQL_DATABASE_PASSWORD"),
                database: this.config.get("SQL_DATABASE_NAME")
            });
            return fn(connection);
        } catch (error) {
            await connection?.end();
            throw error;
        }
    }
}
