import { Storage } from "../storage/storage.types.mjs";

export interface CapsulesService {
    getAmount(): Promise<number>;
    add(amount: number, user: string): Promise<number>;
    canRecycle(): Promise<boolean>;
    recycle(user: string): Promise<void>;
}

export class CapsulesServiceImpl implements CapsulesService {
    private static readonly MIN_RECYCLE_AMOUNT = 100;

    public constructor(private readonly repository: Storage) {}

    public async getAmount(): Promise<number> {
        const transaction = await this.repository.getLastTransaction();
        return transaction?.capsules ?? 0;
    }

    public async add(amount: number, user: string): Promise<number> {
        const capsulesBefore = await this.getAmount();
        const capsules = capsulesBefore + amount;
        await this.repository.addTransaction({ type: "add", amount, capsules, user });
        return Promise.resolve(capsules);
    }

    public async canRecycle(): Promise<boolean> {
        const amount = await this.getAmount();
        return amount >= CapsulesServiceImpl.MIN_RECYCLE_AMOUNT;
    }

    public async recycle(user: string): Promise<void> {
        const amount = await this.getAmount();
        await this.repository.addTransaction({ type: "recycle", amount, capsules: 0, user });
    }
}
