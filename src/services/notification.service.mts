import { UsersService } from "./users.service.mjs";
import { BaseBot, IBaseBot } from "../bot/bot.base.mjs";

export interface NotificationService extends IBaseBot {
    notifyAll(currentUserId: number, message: string): Promise<void>;
}

export class NotificationServiceImpl extends BaseBot implements NotificationService {
    public constructor(private readonly usersService: UsersService) {
        super();
    }

    public async notifyAll(currentUserId: number, message: string): Promise<void> {
        await Promise.all(
            this.usersService.users
                .filter(userId => userId !== currentUserId)
                .map(userId => this.bot.telegram.sendMessage(userId, message))
        );
    }
}
