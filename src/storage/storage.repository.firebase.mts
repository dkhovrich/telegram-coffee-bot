import admin from "firebase-admin";
import { StorageRepository, Transaction, transactionScheme } from "./storage.types.mjs";
import { ConfigService } from "../services/config.service.mjs";
// @ts-ignore
import serviceAccount from "./firebaseAccountKey.json" assert { type: "json" };
import { AddTransactionModel } from "./storage.repository.sql.mjs";

export class StorageRepositoryFirebase implements StorageRepository {
    private readonly database: admin.firestore.Firestore;

    public constructor(private readonly config: ConfigService) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            databaseURL: this.config.get("FIREBASE_DATABASE_URL")
        });

        this.database = admin.firestore();
    }

    public init(): Promise<void> {
        return Promise.resolve();
    }

    public async getLastTransaction(): Promise<Transaction | null> {
        const document = await this.database.collection("transactions").orderBy("createdAt", "desc").limit(1).get();
        if (document.empty) {
            return null;
        }
        const doc = document.docs[0]!;
        const transaction: Transaction = {
            id: doc.id,
            type: doc.get("type"),
            amount: doc.get("amount"),
            capsules: doc.get("capsules"),
            user: doc.get("user"),
            createdAt: doc.get("createdAt").toDate()
        };
        return transactionScheme.safeParse(transaction).success ? transaction : null;
    }

    public async addTransaction(transaction: AddTransactionModel): Promise<void> {
        await this.database.collection("transactions").add({
            ...transaction,
            createdAt: admin.firestore.Timestamp.fromDate(new Date())
        });
    }
}
