export interface StorageService {
    getAmount(): Promise<number>;
    add(amount: number, user: string): Promise<number>;
    recycle(user: string): Promise<void>;
}

interface Transaction {
    type: "add" | "recycle";
    amount: number;
    capsulesBefore: number;
    capsulesAfter: number;
    user: string;
    timestamp: number;
}

interface State {
    transactions: Transaction[];
}

export class StorageServiceImpl implements StorageService {
    private state: State = { transactions: [] };

    getAmount(): Promise<number> {
        const lastTransaction = this.state.transactions.at(-1);
        return Promise.resolve(lastTransaction?.capsulesAfter ?? 0);
    }

    async add(amount: number, user: string): Promise<number> {
        const capsulesBefore = await this.getAmount();
        const transaction: Transaction = {
            type: "add",
            amount,
            capsulesBefore,
            capsulesAfter: capsulesBefore + amount,
            user,
            timestamp: Date.now()
        };
        this.state.transactions.push(transaction);
        return transaction.capsulesAfter;
    }

    async recycle(user: string): Promise<void> {
        const amount = await this.getAmount();
        const transaction: Transaction = {
            type: "recycle",
            amount,
            capsulesBefore: amount,
            capsulesAfter: 0,
            user,
            timestamp: Date.now()
        };
        this.state.transactions.push(transaction);
    }
}
