import { UsersService } from "./users.service.mjs";
import { BotProvider } from "../bot/bot.provider.mjs";

export interface NotificationService {
    notifyAll(currentUserId: number, message: string): Promise<void>;
}

export class NotificationServiceImpl implements NotificationService {
    constructor(private readonly usersService: UsersService, private readonly provider: BotProvider) {}

    public async notifyAll(currentUserId: number, message: string): Promise<void> {
        await Promise.all(
            this.usersService.users
                .filter(userId => userId !== currentUserId)
                .map(userId => this.provider.bot.telegram.sendMessage(userId, message))
        );
    }
}
