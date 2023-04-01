import { Context, Telegraf } from "telegraf";
import { UsersService } from "./users.service.mjs";

export interface NotificationService {
    notifyAll(bot: Telegraf<Context>, currentUserId: number, message: string): Promise<void>;
}

export class NotificationServiceImpl implements NotificationService {
    constructor(private readonly usersService: UsersService) {}

    public async notifyAll(bot: Telegraf<Context>, currentUserId: number, message: string): Promise<void> {
        await Promise.all(
            this.usersService.users
                .filter(userId => userId !== currentUserId)
                .map(userId => bot.telegram.sendMessage(userId, message))
        );
    }
}
