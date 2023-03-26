import { StorageService } from "./storage.types.mjs";
import { StorageRepository } from "./storage.repository.mjs";

export class StorageServiceImpl implements StorageService {
    public constructor(private readonly repository: StorageRepository) {}

    public async get(): Promise<number> {
        const transaction = await this.repository.getLastTransaction();
        return transaction?.capsules ?? 0;
    }

    public async add(amount: number, user: string): Promise<number> {
        const capsulesBefore = await this.get();
        const capsules = capsulesBefore + amount;
        await this.repository.addTransaction({ type: "add", amount, capsules, user });
        return Promise.resolve(capsules);
    }

    public async recycle(user: string): Promise<void> {
        const amount = await this.get();
        await this.repository.addTransaction({ type: "recycle", amount, capsules: 0, user });
    }
}
