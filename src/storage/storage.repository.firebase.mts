import admin from "firebase-admin";
import { AddTransactionModel, StorageRepository, Transaction, transactionScheme } from "./storage.types.mjs";
import { ConfigService } from "../services/config.service.mjs";

export class StorageRepositoryFirebase implements StorageRepository {
    private readonly database: admin.firestore.Firestore;

    public constructor(config: ConfigService) {
        const { credential, databaseURL } = config.firebase;
        admin.initializeApp({
            credential: admin.credential.cert(credential as admin.ServiceAccount),
            databaseURL
        });
        this.database = admin.firestore();
    }

    public async getLastTransaction(): Promise<Transaction | null> {
        const document = await this.database.collection("transactions").orderBy("createdAt", "desc").limit(1).get();
        const doc = document.docs[0];
        if (document.empty || doc == null) {
            return null;
        }
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
