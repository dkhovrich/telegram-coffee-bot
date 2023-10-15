import { UsersService } from "./users.service.mjs";
import { BaseBot, IBaseBot } from "../bot/bot.base.mjs";
import { UserData } from "../bot/commands/utils.mjs";
import { t } from "i18next";

export interface NotificationService extends IBaseBot {
    notifyAdd(user: UserData, addValue: number, amount: number): Promise<void>;
    notifyRecycle(user: UserData): Promise<void>;
}

export class NotificationServiceImpl extends BaseBot implements NotificationService {
    public constructor(private readonly usersService: UsersService) {
        super();
    }

    public async notifyAdd(user: UserData, addValue: number, amount: number): Promise<void> {
        const message = t(addValue > 0 ? "addCommandNotificationAdd" : "addCommandNotificationRemove", {
            user: user.displayName,
            count: Math.abs(addValue),
            amount
        });
        await this.notifyAll(user.id, message);
    }

    public async notifyRecycle(user: UserData): Promise<void> {
        await this.notifyAll(user.id, t("recycleCommandNotification", { user: user.displayName }));
    }

    private async notifyAll(currentUserId: number, message: string): Promise<void> {
        await Promise.all(
            this.usersService.users
                .filter(userId => userId !== currentUserId)
                .map(userId => this.bot.telegram.sendMessage(userId, message))
        );
    }
}
