export interface StorageService {
    get(): Promise<number>;
    add(amount: number, user: string): Promise<number>;
    recycle(user: string): Promise<void>;
}
