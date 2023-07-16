import { Config } from "../config.mjs";

export interface UsersService {
    users: number[];
    isAllowed(id: number): boolean;
}

export class UsersServiceImpl implements UsersService {
    public readonly users: number[];

    constructor(config: Config) {
        this.users = config.userIds;
    }

    public isAllowed(id: number): boolean {
        return this.users.includes(id);
    }
}
