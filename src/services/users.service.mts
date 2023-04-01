import { ConfigService } from "./config.service.mjs";

export interface UsersService {
    users: number[];
    isAllowed(id: number): boolean;
}

export class UsersServiceImpl implements UsersService {
    public readonly users: number[];

    constructor(config: ConfigService) {
        this.users = config.get("USER_IDS").split(",").map(Number);
    }

    public isAllowed(id: number): boolean {
        return this.users.includes(id);
    }
}
