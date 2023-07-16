import { StorageRepository, StorageService } from "./storage.types.mjs";
import { createLogger } from "../logger.mjs";

export class StorageServiceImpl implements StorageService {
    private logger = createLogger("StorageService");

    public constructor(private readonly repository: StorageRepository) {}

    public async init(): Promise<void> {
        this.logger.info("Initialize");
        await this.repository.init();
    }

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
